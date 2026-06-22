"use client"

import Link from "next/link";
import { UserButton, SignInButton, useAuth  } from "@clerk/nextjs";
import { LayoutDashboard, FileText, Settings, Folder } from "lucide-react";

interface NavbarProps {
    workspaceId: string;
}

export function Navbar({ workspaceId }: NavbarProps) {
    // Retieve the authentication state directly from Clerk's core engine
    const { isLoaded, userId } = useAuth();

    return (
        <nav className="bg-white border-b border-neutral-200 px-6 py-3 flex
        items-center justify-betwee sticky top-0 z-50">
            <div className="flex flex-1 items-center gap-8">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="bg-blue-600 p-1.5 rounded-md">
                        <Folder className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-neutral-900 tracking-tight">Syncro</span>
                </Link>
            </div>

            {/* Workspace Navigation */}
            {isLoaded && ( 
                userId ? (
                    <div className="flex items-center gap-1 text-sm font-medium text-neutral-600 space-x-2">
                        <Link
                            href={`/workspace/${workspaceId}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-100
                            text-neutral-900 transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Board
                        </Link>

                        <Link
                            href={`/workspace/${workspaceId}/docs`}
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-100
                            text-neutral-900 transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            Docs
                        </Link>

                        <Link
                            href={`/workspace/${workspaceId}/settings`}
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-100
                            text-neutral-900 transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                        <div className="flex items-center gap-4 space-x-2">
                            <UserButton />
                        </div>
                    </div>
                ) : (
                        <SignInButton mode="modal">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4
                            py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                Sign In
                            </button>
                        </SignInButton>
                    )
                )}
        </nav>
    )
}