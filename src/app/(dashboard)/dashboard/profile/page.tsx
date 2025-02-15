"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Trophy, Target, Clock, Calendar } from "lucide-react"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  setTimeout(() => setIsLoading(false), 1500)

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-24 h-24 rounded-full bg-[#00ff9d]/20" />
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white">John Doe</h1>
                <p className="text-[#00ff9d]">@johndoe</p>
                <p className="text-white/60">Joined December 2023</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-[#00ff9d]/10 border-0 p-6">
                <Trophy className="w-8 h-8 text-[#00ff9d] mb-4" />
                <p className="text-3xl font-bold text-white">156</p>
                <p className="text-[#00ff9d]">Total Wins</p>
              </Card>

              <Card className="bg-[#00ff9d]/10 border-0 p-6">
                <Target className="w-8 h-8 text-[#00ff9d] mb-4" />
                <p className="text-3xl font-bold text-white">75%</p>
                <p className="text-[#00ff9d]">Win Rate</p>
              </Card>

              <Card className="bg-[#00ff9d]/10 border-0 p-6">
                <Clock className="w-8 h-8 text-[#00ff9d] mb-4" />
                <p className="text-3xl font-bold text-white">432</p>
                <p className="text-[#00ff9d]">Games Played</p>
              </Card>

              <Card className="bg-[#00ff9d]/10 border-0 p-6">
                <Calendar className="w-8 h-8 text-[#00ff9d] mb-4" />
                <p className="text-3xl font-bold text-white">89</p>
                <p className="text-[#00ff9d]">Days Active</p>
              </Card>
            </div>

            {/* Match History */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Match History</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="bg-[#00ff9d]/10 border-0 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#00ff9d]/20" />
                        <div>
                          <p className="text-white">vs Player {i}</p>
                          <p className="text-sm text-[#00ff9d]">3 days ago</p>
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

