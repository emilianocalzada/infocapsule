import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalMutation, internalQuery } from "../_generated/server";
import { mutationWithAuth, queryWithAuth } from "../auth";

export const getRssFeed = queryWithAuth({
  args: {
    id: v.id("rssFeeds"),
  },
  handler: async (ctx, args) => {
    const feed = await ctx.db.get(args.id);
    if (feed === null) {
      throw new Error("Feed not found");
    }
    if (feed.userId !== ctx.authUserId) {
      throw new Error("Not authorized");
    }
    return feed;
  },
});

export const createRssFeed = mutationWithAuth({
  args: {
    url: v.string(),
    selectors: v.optional(v.object({
      containerSelector: v.string(),
      headlineSelector: v.string(),
      summarySelector: v.string(),
    })),
    sourceType: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const feedId = await ctx.db.insert("rssFeeds", {
        url: args.url,
        userId: ctx.authUserId,
        rrsUrl: "",
        selectors: args.selectors,
        sourceType: args.sourceType,
        fetchrssId: "",
        status: "active",
      });
      await ctx.scheduler.runAfter(0, internal.parser.rss.createFeed, {
        feedId,
        url: args.url,
        containerSelector: args.selectors?.containerSelector,
        headlineSelector: args.selectors?.headlineSelector,
        summarySelector: args.selectors?.summarySelector,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create feed");
    }
  },
});

export const deleteRssFeed = mutationWithAuth({
  args: {
    id: v.id("rssFeeds"),
  },
  handler: async (ctx, args) => {
    const feed = await ctx.db.get(args.id);
    if (feed === null) {
      throw new Error("Feed not found");
    }

    if (feed.userId !== ctx.authUserId) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);

    // check if there is any other feed item with the same fetchrssId
    const otherFeeds = await ctx.db
      .query("rssFeeds")
      .withIndex("byFetchrssId", (q) => q.eq("fetchrssId", feed.fetchrssId))
      .collect();
    
    const other = otherFeeds.filter((feed: any) => feed._id !== args.id);
    
    if (other.length === 0) {
      // call fetchrss.com api to delete feed
      await ctx.scheduler.runAfter(0, internal.parser.rss.deleteFeed, {
        feedId: feed.fetchrssId,
      });
      return;
    }
  },
});

export const listRssFeeds = queryWithAuth(async (ctx) => {
  const rssFeeds = await ctx.db
    .query("rssFeeds")
    .withIndex("byUserId", (q) => q.eq("userId", ctx.authUserId))
    .order("desc")
    .collect();

  return rssFeeds;
});

export const updateRssFeed = internalMutation({
  args: {
    feedId: v.id("rssFeeds"),
    rrsUrl: v.string(),
    fetchrssId: v.string(),
    status: v.union(v.literal("active"), v.literal("error")),
  },
  handler: async (ctx, { feedId, rrsUrl, fetchrssId, status }) => {
    await ctx.db.patch(feedId, {
      rrsUrl,
      fetchrssId,
      status,
    });
  },
});

export const listRssFeedsInternal = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const rssFeeds = await ctx.db
      .query("rssFeeds")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Filter out any feeds that are not active
    const activeFeeds = rssFeeds.filter((feed: any) => feed.status === "active");

    return activeFeeds;
  },
});

export const updateLastFetched = internalMutation({
  args: {
    feedId: v.id("rssFeeds"),
    lastFetched: v.number(),
  },
  handler: async (ctx, { feedId, lastFetched }) => {
    await ctx.db.patch(feedId, {
      lastFetched,
    });
  },
});

export const sendTestDigest = mutationWithAuth({
  handler: async (ctx) => {
    // Schedule the test digest processing as an action
    await ctx.scheduler.runAfter(0, internal.parser.rss.processTestDigest, {
      userId: ctx.authUserId,
    });

    return { success: true };
  },
});
