import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import { mutationWithAuth, queryWithAuth } from "../auth";


export const getUser = internalQuery({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, { userId }) => {
        const user = await ctx.db.get(userId);
        if (user === null) {
            throw new Error("User not found");
        }
        return user;
    },
});

export const getAuthUser = queryWithAuth(async (ctx) => {
    const user = await ctx.db.get(ctx.authUserId);
    if (user === null) {
        throw new Error("User not found");
    }
    return user;
});

export const getUsersByTimeSlot = internalQuery({
    args: {
        timeSlot: v.string(),
    },
    handler: async (ctx, { timeSlot }) => {
        return await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("preferredTime"), timeSlot))
            .collect();
    },
});

export const setPreferredTime = mutationWithAuth({
    args: {
        preferredTime: v.union(
            v.literal("06:00"),
            v.literal("12:00"),
            v.literal("18:00"),
            v.literal("24:00")
        ),
    },
    handler: async (ctx, { preferredTime }) => {
        await ctx.db.patch(ctx.authUserId, { preferredTime });
    },
});


export const togglePaused = mutationWithAuth({
    handler: async (ctx) => {
        const user = await ctx.db.get(ctx.authUserId);
        if (user === null) {
            throw new Error("User not found");
        }
        await ctx.db.patch(ctx.authUserId, { paused: !user.paused });
    },
});

export const incrementEmailStat = internalMutation({
    args: {
        userEmail: v.string(),
        statType: v.union(v.literal("delivered"), v.literal("bounced"), v.literal("complained")),
    },
    handler: async (ctx, { userEmail, statType }) => {
        // Find user by email
        const user = await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", userEmail))
            .unique();

        if (!user) {
            console.log(`User not found for email: ${userEmail}`);
            return;
        }

        // Get current count or default to 0
        const currentCount = user[`${statType}Count`] || 0;

        // Increment the appropriate counter
        const updateData: any = {};
        updateData[`${statType}Count`] = currentCount + 1;

        await ctx.db.patch(user._id, updateData);

        console.log(`Incremented ${statType}Count for user ${userEmail}: ${currentCount} -> ${currentCount + 1}`);
    },
});
