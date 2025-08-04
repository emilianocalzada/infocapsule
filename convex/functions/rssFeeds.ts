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
      });
      await ctx.scheduler.runAfter(0, internal.parser.rss.createFeed, {
          feedId,
          url: args.url,
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

    // call fetchrss.com api to delete feed
    await ctx.scheduler.runAfter(0, internal.parser.rss.deleteFeed, {
        feedId: feed.fetchrssId,
    });

    return await ctx.db.delete(args.id);
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
    },
    handler: async (ctx, { feedId, rrsUrl, fetchrssId }) => {
        await ctx.db.patch(feedId, {
            rrsUrl,
            fetchrssId,
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
    
        return rssFeeds;
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
