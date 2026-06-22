import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        // Verify the user is authenticated
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized.");
        }

        // Look up the internal user record by their Clerk ID
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) {
            throw new Error("User record not found. Sync might be delayed.")
        }

        // Insert the new workspace into the database
        const workspaceId = await ctx.db.insert("workspaces", {
            name: args.name,
            ownerId: user._id,
        });

        // Create the Role-Based Access Control (RBAC) link
        await ctx.db.insert("workspaceMembers", {
            workspaceId: workspaceId,
            userId: user._id,
            role: "admin",
        });

        return workspaceId;
    },
});

export const getMine = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) return [];

        // First, find all memberships for this specific user
        const memberships = await ctx.db
            .query("workspaceMembers")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        // Then fetch the actual workspace details for each membership
        const workspaces = await Promise.all(
            memberships.map(async (m) => {
                const workspace = await ctx.db.get(m.workspaceId);
                return {
                    ...workspace,
                    role: m.role,
                };
            })
        );

        // Filter out any potential nulls
        return workspaces.filter((w) => w.name !== undefined);
    },
});