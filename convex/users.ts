import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const syncUser = internalMutation({
    args: {
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        avatarUrl: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        // Check if the user already exists using the index we created
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (existingUser) {
            // Update exisiting user data
            return await ctx.db.patch(existingUser._id, {
                name: args.name,
                email: args.email,
                avatarUrl: args.avatarUrl
            });
        }

        // Insert new user
        return await ctx.db.insert("users", {
            clerkId: args.clerkId,
            name: args.name,
            email: args.email,
            avatarUrl: args.avatarUrl,
        });
    },
});