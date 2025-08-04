import { Email } from "@convex-dev/auth/providers/Email";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
import { Resend as ResendAPI } from "resend";
 
export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.RESEND_API_KEY,
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };
 
    const alphabet = "0123456789";
    const length = 6;
    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: "InfoCapsule <onboarding@infocapsule.today>",
      to: [email],
      subject: `Your InfoCapsule verification code`,
      text: `Welcome to InfoCapsule! Your verification code is: ${token}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this code, you can safely ignore this email.`,
    });
 
    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});