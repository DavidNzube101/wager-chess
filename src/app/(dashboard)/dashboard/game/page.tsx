"use client"

import { AppShell } from "@/components/layout/app-shell"

export default function GamePage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Game</h1>
        <div className="aspect-square w-full max-w-3xl mx-auto bg-[#00ff9d]/10 rounded-lg">
          {/* Game board will go here */}
        </div>
      </div>
    </AppShell>
  )
}

