import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Users
    users: defineTable({
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        avatarUrl: v.optional(v.string()),
    }).index("by_clerkId", ["clerkId"]),

    // Workspaces
    workspaces: defineTable({
        name: v.string(),
        ownerId: v.id("users"),
    }),

    // Role-Based Access Control
    workspaceMembers: defineTable({
        workspaceId: v.id("workspaces"),
        userId: v.id("users"),
        role: v.union(v.literal("admin"), v.literal("editor"), v.literal(("viewer")))
    })
    .index("by_workspace", ["workspaceId"])
    .index("by_user", ["userId"])
    .index("by_workspace_user", ["workspaceId", "userId"]),

    // Documents
    documents: defineTable({
        workspaceId: v.id("workspaces"),
        title: v.string(),
        createdBy: v.id("users"),
        isAcrhived: v.boolean()
    }).index("by_workspace", ["workspaceId"]),

    // Documents Blocks
    documentBlocks: defineTable({
        documentId: v.id("documents"),
        type: v.union(v.literal("paragraph"), v.literal("h1"), v.literal("h2"), v.literal("code")),
        content: v.string(),

        // Float64 allows us to easily insert new blocks between existing ones
        position: v.number(),

        lockedBy: v.optional(v.id("users"))
    })
    .index("by_document", ["documentId"])
    .index("by_document_position", ["documentId", "position"]),

    // Tickets (Kanban)
    tickets: defineTable({
        workspaceId: v.id("workspaces"),
        title: v.string(),
        status: v.string(),
        priority: v.union(v.literal("Low"), v.literal("Medium"), v.literal("High")),
        poaition: v.number(),
    })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_status", ["workspaceId", "status"])
});