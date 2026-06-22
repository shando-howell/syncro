import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const clerkWebhook = httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
        throw new Error("Please add your Clerk webhook secret.");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_timestamp = request.headers.get("svix-timestamp");
    const svix_signature = request.headers.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing Svix headers", { status: 400 });
    }

    const payloadString = await request.text();
    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
        evt = wh.verify(payloadString, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error verifying webhook", { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
        const { id, first_name, last_name, email_addresses, image_url } = evt.data;

        const name = [first_name, last_name].filter(Boolean).join(" ") || "Anonymous";
        const email = email_addresses[0]?.email_address || "";

        try {
            await ctx.runMutation(internal.users.syncUser, {
                clerkId: id,
                name,
                email,
                avatarUrl: image_url,
            });
            console.log(`Successfully synced user ${id} to Convex.`);
        } catch (error) {
            console.error("Failed to sync user to Convex:", error);
            return new Response("Error syncing user to database", { status: 500 });
        }
    }

    return new Response("Webhook processed successfully", { status: 200});
});