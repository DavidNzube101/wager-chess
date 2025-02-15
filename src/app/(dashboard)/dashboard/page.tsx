"use client"

import { useState } from "react"
import { Grid, Users, BotIcon, User2 } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Card } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  setTimeout(() => setIsLoading(false), 1500)

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        {/* Header - Hidden on desktop as it's in sidebar */}
        <div className="flex justify-between items-center mb-8 lg:hidden">
          <h1 className="text-[#00ff9d] text-3xl font-bold">Play it</h1>
          <div className="w-8 h-8 rounded-full bg-[#00ff9d]/10 flex items-center justify-center">
            <Grid className="w-5 h-5 text-[#00ff9d]" />
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            {/* Game Modes */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-[#00ff9d]/10 border-0 p-6 hover:bg-[#00ff9d]/20 transition-colors">
                <div className="flex flex-col h-full">
                  <Users className="w-8 h-8 text-[#00ff9d] mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Competitive</h3>
                  <p className="text-[#00ff9d] mb-4">Player vs Player</p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-white/60">84 | 25</span>
                    <span className="text-[#00ff9d]">→</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#00ff9d]/10 border-0 p-6 hover:bg-[#00ff9d]/20 transition-colors">
                <div className="flex flex-col h-full">
                  <BotIcon className="w-8 h-8 text-[#00ff9d] mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Against the</h3>
                  <p className="text-[#00ff9d] mb-4">machine</p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-white/60">LEVEL 5</span>
                    <span className="text-[#00ff9d]">→</span>
                  </div>
                </div>
              </Card>

              <Card className="sm:col-span-2 lg:col-span-1 bg-[#00ff9d]/10 border-0 p-6 hover:bg-[#00ff9d]/20 transition-colors">
                <div className="flex items-center gap-4">
                  <User2 className="w-8 h-8 text-[#00ff9d]" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Challenge</h3>
                    <p className="text-[#00ff9d]">a friend</p>
                  </div>
                  <span className="ml-auto text-[#00ff9d]">→</span>
                </div>
              </Card>
            </div>

            {/* Recent Matches */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Recent Matches</h2>
                <span className="text-[#00ff9d]">12</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-[#00ff9d]/10 border-0 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#00ff9d]/20" />
                        <div>
                          <p className="text-white">Player {i}</p>
                          <p className="text-sm text-[#00ff9d]">Blitz</p>
                        </div>
                      </div>
                      <span className="text-[#00ff9d]">Win</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

