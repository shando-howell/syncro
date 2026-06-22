import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Folder, ArrowRight, Layout, Zap, Shield } from "lucide-react";

export default async function HomePage() {
  // Auth check
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans flex flex-col">
      {/* Public Navbar */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Folder className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Syncro</span>
        </div>
        <div className="flex items-center gap-4">
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700
            transition-colors">
              Get Started
            </button>
          </SignUpButton>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 leading-tight">
            The real-time workspace for <span className="text-blue-600">engineering teams.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Manage your state, synchronize your docs and build faster with kanban boards built for
            modern development cycles.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl
              text-lg font-medium hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 
              transition-all duration-200">
                Start Building Free <ArrowRight className="w-5 h-5" />
              </button>
            </SignUpButton>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
          <div>
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
            {/* <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center
            justify-center mb-4">
              <div>
                <Zap className="w-6 h-6" />
              </div>
            </div> */}
            <h3 className="text-lg font-semibold mb-2">Real-Time Sync</h3>
            <p className="text-neutral-500 text-smj leading-relaxed">
              Changes stream instantly across all clients using robust WebSocket infrastructure.
            </p>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
            {/* <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center
            justify-center mb-4">
              <Layout className="w-6 h-6" />
            </div> */}
            <h3 className="text-lg font-semibold mb-2">Multiplayer Boards</h3>
            <p className="text-neutral-500 text-smj leading-relaxed">
              Drag and drop tickets with built-in optimistic concurrency control.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
            {/* <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center
            justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div> */}
            <h3 className="text-lg font-semibold mb-2">Secure Isolation</h3>
            <p className="text-neutral-500 text-smj leading-relaxed">
              Granular RBAC ensures your workspace data is completely isolated and secure.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
