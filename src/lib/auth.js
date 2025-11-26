import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import MagicLinkEmail from "../../email/MagicLink";
import { db } from "../db/drizzle/index"; // your drizzle instance
import { resend } from "./resend";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  plugins: [
    magicLink({
      async sendMagicLink(data) {
        "use server";

        await resend.emails.send({
          from: "???",
          to: data.email,
          subject: "Your magic link",
          react: MagicLinkEmail({ magicLink: data.url }),
        });
      },
    }),
  ]
});