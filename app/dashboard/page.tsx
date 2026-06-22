"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserButton } from "@clerk/nextjs";
import { Plus, Folder, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    // Fetching the user's specific workspaces
    const workspaces = useQuery(api.workspaces.getMine);
    const createWorkspace = useMutation(api.workspaces.create);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWorkspaceName.trim()) return;

        setIsCreating(true);
        try {
            await createWorkspace({ name: newWorkspaceName.trim() });
            setNewWorkspaceName("")
        } catch (error) {
            console.error("Failed to create workspace:", error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
            <main className="max-w-6xl mx-auto px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold tracking-tight">Your Workspaces</h2>
                </div>

                {/* Workspace grid and creation form */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create new workspace card */}
                    <form
                        onSubmit={handleCreate}
                        className="flex flex-col justify-cneter h-48 border-2 border-dashed
                        border-neutral-300 rounded-xl p-6 bg-transparent hover:border-blue-500 
                        hover:bg-blue-50/50 transition-all duration-200 group"
                    >
                        <input
                            type="text"
                            placeholder="New workspace name..."
                            value={newWorkspaceName}
                            onChange={(e) => setNewWorkspaceName(e.target.value)}
                            className="bg-transparent border-b border-neutral-300 focus:border-blue-600 outline-none
                            pax-1 py-2 mb-4 text-lg font-medium placeholder:text-neutral-400 group-hover:border-blue-400
                            transition-colors"
                            disabled={isCreating}
                        />
                        <button
                            type="submit"
                            disabled={isCreating || !newWorkspaceName.trim()}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-lg
                            font-medium hoover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            {isCreating ? "Creating..." : "Create Workspace"}
                        </button>
                    </form>

                    {/* Loading State */}
                    {workspaces === undefined && (
                        <>
                            {[1, 2].map((i) => (
                                <div key={i} className="h-48 bg-neutral-200 rounded-xl animate-pulse" />
                            ))}
                        </>
                    )}

                    {/* Render Workspaces */}
                    {workspaces && workspaces.map((workspace) => (
                        <Link
                            href={`dashboard/workspace/${workspace._id}`}
                            key={workspace._id}
                        >
                            <div
                                className="group flex flex-col justify-between h-48 bg-white border
                                border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-200
                                transition-all duration-200 cursor-pointer"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-semibold truncate">{workspace.name}</h3>
                                        <span className="text-xs font-medium px-2.5 py-1 bg-neutral-100 text-neutral-600 
                                        rounded-full capitalize">
                                            {workspace.role}
                                        </span>
                                    </div>
                                    <p className="text-sm text-neutral-500">
                                        Manage documents and team boards.
                                    </p>
                                </div>

                                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1
                                transition-transform">
                                    Enter Workspace <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}