import { Resend, vEmailEvent, vEmailId } from "@convex-dev/resend";
import { v } from "convex/values";
import { components, internal } from "../_generated/api";
import { internalMutation } from "../_generated/server";

const testMode = process.env.TEST_MODE === "true";
export const resend: Resend = new Resend(components.resend, {
  testMode,
  onEmailEvent: internal.functions.sendEmail.handleEmailEvent,
});

export const handleEmailEvent = internalMutation({
    args: {
        id: vEmailId,
        event: vEmailEvent,
    },
    handler: async (ctx, args) => {
        console.log("Got email event callback!", args.id, args.event);

        // Get the email details from the Resend component
        const emailDetails = await ctx.runQuery(components.resend.lib.get, { emailId: args.id });

        if (!emailDetails) {
            console.log("No email found for id", args.id);
            return;
        }

        const recipientEmail = emailDetails.to;

        // Handle different event types
        if (args.event.type === "email.delivered") {
            await ctx.runMutation(internal.functions.users.incrementEmailStat, {
                userEmail: recipientEmail,
                statType: "delivered",
            });
        } else if (args.event.type === "email.bounced") {
            await ctx.runMutation(internal.functions.users.incrementEmailStat, {
                userEmail: recipientEmail,
                statType: "bounced",
            });
        } else if (args.event.type === "email.complained") {
            await ctx.runMutation(internal.functions.users.incrementEmailStat, {
                userEmail: recipientEmail,
                statType: "complained",
            });
        }
    },
});

export const sendDailyDigest = internalMutation({
    args: {
        userId: v.id("users"),
        subject: v.string(),
        content: v.string(),
    },
    handler: async (ctx, { userId, subject, content }) => {
        let email = "delivered@resend.dev";
        if (!testMode) {
          const user = await ctx.runQuery(internal.functions.users.getUser, { userId });
          if (!user.email) {
              throw new Error("User has no email");
          }
          email = user.email;
        }

        await resend.sendEmail(ctx, {
            from: "InfoCapsule <digest@infocapsule.today>",
            to: email,
            subject,
            html: content,
        });
    },
});
