import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // Custom fields
    preferredTime: v.optional(v.union(
      v.literal("06:00"),
      v.literal("12:00"),
      v.literal("18:00"),
      v.literal("24:00")
    )),
    deliveredCount: v.optional(v.number()),
    bouncedCount: v.optional(v.number()),
    complainedCount: v.optional(v.number()),
    paused: v.optional(v.boolean()),
  }).index("email", ["email"])
    .index("byPreferredTime", ["preferredTime"]),

  rssFeeds: defineTable({
    url: v.string(),
    userId: v.id("users"),
    rrsUrl: v.string(), // Store fetchrss.com feed url
    fetchrssId: v.string(), // Store fetchrss.com feed id
    lastFetched: v.optional(v.number()),
    // CSS selectors for website scraping
    selectors: v.optional(v.object({
      containerSelector: v.string(),
      headlineSelector: v.string(),
      summarySelector: v.string(),
    })),
    sourceType: v.string(),
  }).index("byUserId", ["userId"]),
  logs: defineTable({
    message: v.string(),
    feedId: v.id("rssFeeds"),
    userId: v.id("users"),
    timestamp: v.number(),
  }).index("byUserId", ["userId"])
    .index("byFeedId", ["feedId"]),
});

export default schema;
