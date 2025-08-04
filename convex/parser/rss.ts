"use node"

import { v } from "convex/values";
import Parser from 'rss-parser';
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";

export const processDailyReports = internalAction({
    args: {
        timeSlot: v.union(
            v.literal("06:00"),
            v.literal("12:00"),
            v.literal("18:00"),
            v.literal("24:00")
        ),
    },
    handler: async (ctx, { timeSlot }) => {
        // Get all users who want reports at this time
        const users = await ctx.runQuery(internal.functions.users.getUsersByTimeSlot, { timeSlot });

        // filter users that have the paused status
        const activeUsers = users.filter((user: any) => !user.paused);

        console.log(`Processing ${activeUsers.length} non-paused users for time slot ${timeSlot}`);

        await Promise.all(activeUsers.map(async (user) => {
            try {
                await processUserFeeds(ctx, user._id);
            } catch (error) {
                console.error(`Failed to process feeds for user ${user._id}:`, error);
            }
        }));
    },
});

export const processTestDigest = internalAction({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, { userId }) => {
        console.log(`Processing test digest for user ${userId}`);

        try {
            await processUserFeedsForTest(ctx, userId);
        } catch (error) {
            console.error(`Failed to process test digest for user ${userId}:`, error);
            throw error;
        }
    },
});

export const createFeed = internalAction({
    args: {
        feedId: v.id("rssFeeds"),
        url: v.string(),
        containerSelector: v.optional(v.string()),
        headlineSelector: v.optional(v.string()),
        summarySelector: v.optional(v.string()),
    },
    handler: async (ctx, { feedId, url, containerSelector, headlineSelector, summarySelector }) => {
        // Insert into fetchrss.com
        const formData = new FormData();
        formData.append('url', url);

        if (containerSelector) {
            formData.append('news_selector', containerSelector);
        }
        if (headlineSelector) {
            formData.append('title_selector', headlineSelector);
        }
        if (summarySelector) {
            formData.append('content_selector', summarySelector);
        }

        console.log("Creating feed with data:", formData);

        const response = await fetch('https://fetchrss.com/api/v2/feeds', {
            method: 'POST',
            headers: {
                'API-KEY': process.env.FETCHRSS_API_KEY || "",
            },
            body: formData
        });
        const data = await response.json();
        console.log(data);

        if (data.success) {
            await ctx.runMutation(internal.functions.rssFeeds.updateRssFeed, {
                feedId,
                rrsUrl: data.feed.rss_url,
                fetchrssId: data.feed.id,
                status: "active",
            });
        } else {
            console.error(`Failed to create feed: ${data}`);

            await ctx.runMutation(internal.functions.rssFeeds.updateRssFeed, {
                feedId,
                status: "error",
                rrsUrl: "",
                fetchrssId: "",
            });
        }
    },
});

export const deleteFeed = internalAction({
    args: {
        feedId: v.string(),
    },
    handler: async (ctx, { feedId }) => {
        try {
            // Delete from fetchrss.com
            const response = await fetch(`https://fetchrss.com/api/v2/feeds/${feedId}`, {
                method: 'DELETE',
                headers: {
                    'API-KEY': process.env.FETCHRSS_API_KEY || "",
                },
            });
            const data = await response.json();
            if (data?.success) {
                console.log(`Deleted feed ${feedId} from fetchrss.com`);
            }
        } catch (error) {
            console.error(`Failed to delete feed ${feedId}:`, error);
        }
    },
});


async function processUserFeeds(ctx: any, userId: string) {
    const feedItems = await ctx.runQuery(internal.functions.rssFeeds.listRssFeedsInternal, { userId });
    let newItems: any[] = [];

    // Use rss-parser to fetch and parse RSS feeds
    await Promise.all(feedItems.map(async (feedItem: any) => {
        try {
            let parser = new Parser();
            const feed = await parser.parseURL(feedItem.rrsUrl);

            const lastFetched = feedItem.lastFetched;
            feed.items?.forEach((item: any) => {
                try {
                    const itemDate = item.date || item.pubDate || item.isoDate;
                    if (!itemDate) {
                        console.warn('Item missing date field:', item.title);
                        return;
                    }

                    const itemDateTime = new Date(itemDate);
                    if (isNaN(itemDateTime.getTime())) {
                        console.warn('Invalid date format:', itemDate);
                        return;
                    }

                    if (!lastFetched || itemDateTime > new Date(lastFetched)) {
                        newItems.push(item);
                    }
                } catch (error) {
                    console.error('Error processing item date:', error);
                }
            });

            await ctx.runMutation(internal.functions.rssFeeds.updateLastFetched, {
                feedId: feedItem._id,
                lastFetched: Date.now()
            });

            await ctx.runMutation(internal.functions.logs.addLog, {
                message: `Fetched feed with ${feed.items?.length} new items`,
                feedId: feedItem._id,
                userId,
            });
        } catch (error) {
            await ctx.runMutation(internal.functions.logs.addLog, {
                message: `Failed to fetch feed: ${error}`,
                feedId: feedItem._id,
                userId,
            });
            console.error(`Failed to fetch feed:`, error);
        }
    }));
    console.log(`Found ${newItems.length} new items for user ${userId}`);

    if (newItems.length > 0) {
        const summary = await ctx.runAction(internal.parser.ai.summarize, {
            text: JSON.stringify(newItems)
        });

        console.log(summary);

        if (summary) {
            // Send email using your existing resend setup
            await ctx.runMutation(internal.functions.sendEmail.sendDailyDigest, {
                userId,
                subject: summary.subject,
                content: summary.content
            });
        }
    }
}

async function processUserFeedsForTest(ctx: any, userId: string) {
    const feedItems = await ctx.runQuery(internal.functions.rssFeeds.listRssFeedsInternal, { userId });

    if (feedItems.length === 0) {
        throw new Error("No RSS feeds found. Please add some information sources first.");
    }

    let testItems: any[] = [];

    // Use rss-parser to fetch and parse RSS feeds - get 5 most recent items from each feed
    await Promise.all(feedItems.map(async (feedItem: any) => {
        try {
            let parser = new Parser();
            const feed = await parser.parseURL(feedItem.rrsUrl);

            // Get the 5 most recent items from this feed (regardless of lastFetched)
            const recentItems = feed.items?.slice(0, 5) || [];
            testItems.push(...recentItems);

            await ctx.runMutation(internal.functions.logs.addLog, {
                message: `Test digest: Fetched ${recentItems.length} recent items from feed`,
                feedId: feedItem._id,
                userId,
            });
        } catch (error) {
            await ctx.runMutation(internal.functions.logs.addLog, {
                message: `Test digest: Failed to fetch feed: ${error}`,
                feedId: feedItem._id,
                userId,
            });
            console.error(`Failed to fetch feed:`, error);
        }
    }));

    console.log(`Test digest: Found ${testItems.length} items for user ${userId}`);

    if (testItems.length === 0) {
        throw new Error("No content found in your RSS feeds. Please check your sources or try again later.");
    }

    const summary = await ctx.runAction(internal.parser.ai.summarize, {
        text: JSON.stringify(testItems)
    });

    console.log("Test digest summary:", summary);

    if (summary) {
        // Send email using your existing resend setup
        await ctx.runMutation(internal.functions.sendEmail.sendDailyDigest, {
            userId,
            subject: `[TEST] ${summary.subject}`,
            content: summary.content
        });
    } else {
        throw new Error("Failed to generate summary. Please try again.");
    }
}
