import { v } from "convex/values";
import { internalMutation } from "../_generated/server";
import { queryWithAuth } from "../auth";

export const addLog = internalMutation({
  args: {
    message: v.string(),
    feedId: v.id("rssFeeds"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("logs", {
      message: args.message,
      feedId: args.feedId,
      userId: args.userId,
      timestamp: Date.now(),
    });
  },
});

export const listLogs = queryWithAuth({
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("logs")
      .withIndex("byUserId", (q) => q.eq("userId", ctx.authUserId))
      .order("desc")
      .take(50); // Limit to 50 most recent logs

    const logsWithFeed = await Promise.all(logs.map(async (log: any) => {
        const feed = await ctx.db.get(log.feedId);
        return {
            ...log,
            feed,
        };
    }));

    return logsWithFeed;
  },
});
