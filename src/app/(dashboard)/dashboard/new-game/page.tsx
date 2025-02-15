"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, Bot, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AppShell } from "@/components/layout/app-shell"

type GameMode = "none" | "player" | "ai" | "quick"

export default function NewGamePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [gameMode, setGameMode] = useState<GameMode>("none")
  const [opponentEmail, setOpponentEmail] = useState("")
  const [aiDifficulty, setAiDifficulty] = useState<number>(1)
  const [quickMatchLoading, setQuickMatchLoading] = useState(false)

  // Simulate initial loading
  setTimeout(() => setIsLoading(false), 1500)

  const handleStartGame = () => {
    router.push("/dashboard/game")
  }

  const handleQuickMatch = () => {
    setQuickMatchLoading(true)
    setTimeout(() => {
      router.push("/dashboard/game")
    }, 5000)
  }

  if (isLoading) {
    return (
      <AppShell>
        <LoadingSpinner />
      </AppShell>
    )
  }

  if (quickMatchLoading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
          <p className="text-[#00ff9d] mt-4 text-lg">Finding an opponent...</p>
        </div>
      </AppShell>
    )
  }

  if (gameMode === "player") {
    return (
      <AppShell>
        <div className="max-w-md mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-white">Enter Opponent's Email</h2>
          <Input
            type="email"
            placeholder="opponent@example.com"
            value={opponentEmail}
            onChange={(e) => setOpponentEmail(e.target.value)}
            className="bg-[#00ff9d]/10 border-[#00ff9d]/20 text-white"
          />
          <Button
            onClick={handleStartGame}
            disabled={!opponentEmail}
            className="w-full bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90"
          >
            Start Game
          </Button>
        </div>
      </AppShell>
    )
  }

  if (gameMode === "ai") {
    return (
      <AppShell>
        <div className="max-w-md mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-white">Select Difficulty</h2>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((level) => (
              <Button
                key={level}
                onClick={() => setAiDifficulty(level)}
                variant="outline"
                className={`h-20 ${aiDifficulty === level ? "bg-[#00ff9d] text-black" : "bg-[#00ff9d]/10 text-white"}`}
              >
                Level {level}
              </Button>
            ))}
          </div>
          <Button onClick={handleStartGame} className="w-full bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90">
            Start Game
          </Button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">New Game</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Button
            variant="outline"
            onClick={() => setGameMode("player")}
            className="h-auto aspect-square p-8 bg-[#00ff9d]/10 border-[#00ff9d]/20 hover:bg-[#00ff9d]/20"
          >
            <div className="flex flex-col items-center gap-4">
              <Users className="w-12 h-12 text-[#00ff9d]" />
              <div className="text-center">
                <h3 className="text-lg font-medium text-white">vs Player</h3>
                <p className="text-sm text-[#00ff9d]">Play against a friend</p>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => setGameMode("ai")}
            className="h-auto aspect-square p-8 bg-[#00ff9d]/10 border-[#00ff9d]/20 hover:bg-[#00ff9d]/20"
          >
            <div className="flex flex-col items-center gap-4">
              <Bot className="w-12 h-12 text-[#00ff9d]" />
              <div className="text-center">
                <h3 className="text-lg font-medium text-white">vs AI</h3>
                <p className="text-sm text-[#00ff9d]">Challenge the machine</p>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setGameMode("quick")
              handleQuickMatch()
            }}
            className="h-auto aspect-square p-8 bg-[#00ff9d]/10 border-[#00ff9d]/20 hover:bg-[#00ff9d]/20"
          >
            <div className="flex flex-col items-center gap-4">
              <Clock className="w-12 h-12 text-[#00ff9d]" />
              <div className="text-center">
                <h3 className="text-lg font-medium text-white">Quick Match</h3>
                <p className="text-sm text-[#00ff9d]">Find a random opponent</p>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

