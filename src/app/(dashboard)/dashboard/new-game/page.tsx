"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, Zap, Trophy, Brain, ArrowLeft, Star, X, Timer, Search } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

type TimeControl = {
  time: number
  increment: number
  type: 'Bullet' | 'Blitz' | 'Rapid' | 'Classical'
  label: string
}

type Bot = {
  id: string
  name: string
  rating: number
  bio: string
  image: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert'
}

type GameFormat = 'standard' | 'chess960' | 'crazyhouse'

interface CustomTimeControl {
  minutes: number
  increment: number
  format: GameFormat
}

type UserRating = {
  rating: number
  provisional: boolean  // True if under 15 games played
  gamesPlayed: number
}

type MatchmakingState = {
  status: 'idle' | 'searching' | 'found' | 'timeout'
  timeElapsed: number
  ratingRange: {
    min: number
    max: number
  }
}

const timeControls: TimeControl[] = [
  { time: 1, increment: 0, type: 'Bullet', label: '1+0' },
  { time: 2, increment: 1, type: 'Bullet', label: '2+1' },
  { time: 3, increment: 0, type: 'Blitz', label: '3+0' },
  { time: 3, increment: 2, type: 'Blitz', label: '3+2' },
  { time: 5, increment: 0, type: 'Blitz', label: '5+0' },
  { time: 5, increment: 3, type: 'Blitz', label: '5+3' },
  { time: 10, increment: 0, type: 'Rapid', label: '10+0' },
  { time: 10, increment: 5, type: 'Rapid', label: '10+5' },
  { time: 15, increment: 10, type: 'Rapid', label: '15+10' },
  { time: 30, increment: 0, type: 'Classical', label: '30+0' },
  { time: 30, increment: 20, type: 'Classical', label: '30+20' },
]

const bots: Bot[] = [
  {
    id: 'bot1',
    name: 'Rookie Bot',
    rating: 800,
    bio: 'Perfect for beginners. Plays simple moves.',
    image: '/bots/rookie.png',
    difficulty: 'Easy'
  },
  {
    id: 'bot2',
    name: 'Advanced Bot',
    rating: 1500,
    bio: 'Intermediate level. Understands basic tactics.',
    image: '/bots/advanced.png',
    difficulty: 'Medium'
  },
  {
    id: 'bot3',
    name: 'Master Bot',
    rating: 2200,
    bio: 'Expert level. Strong tactical and strategic play.',
    image: '/bots/master.png',
    difficulty: 'Hard'
  },
  {
    id: 'bot4',
    name: 'Grandmaster Bot',
    rating: 2800,
    bio: 'Highest level. Plays like a super grandmaster.',
    image: '/bots/grandmaster.png',
    difficulty: 'Expert'
  },
]

const gameFormats: { id: GameFormat; name: string; description: string }[] = [
  {
    id: 'standard',
    name: 'Standard Chess',
    description: 'Traditional chess with standard starting position'
  },
  {
    id: 'chess960',
    name: 'Chess960',
    description: 'Random starting position with special castling rules'
  },
  {
    id: 'crazyhouse',
    name: 'Crazyhouse',
    description: 'Captured pieces can be dropped back on the board'
  }
]

// Add these arrays for dropdown options
const timeOptions = [
  1, 2, 3, 5, 7, 10, 15, 20, 30, 45, 60, 90
]

const incrementOptions = [
  0, 1, 2, 3, 5, 10, 15, 20, 30
]

export default function NewGame() {
  const [selectedTime, setSelectedTime] = useState<TimeControl | null>(null)
  const [selectedMode, setSelectedMode] = useState<'ai' | 'player' | null>(null)
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customTime, setCustomTime] = useState<CustomTimeControl>({
    minutes: 10,
    increment: 0,
    format: 'standard'
  })
  const [userRating, setUserRating] = useState<UserRating>({
    rating: 1500,
    provisional: true,
    gamesPlayed: 0
  })
  const [matchmaking, setMatchmaking] = useState<MatchmakingState>({
    status: 'idle',
    timeElapsed: 0,
    ratingRange: {
      min: userRating.rating - 25,
      max: userRating.rating + 400
    }
  })
  const { toast } = useToast()

  useEffect(() => {
    if (matchmaking.status !== 'searching') return

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setMatchmaking(prev => ({ ...prev, timeElapsed: elapsed }))

      if (elapsed >= 60) { // 1 minute
        setMatchmaking(prev => ({ ...prev, status: 'timeout' }))
        toast({
          variant: "destructive",
          title: "No Players Found",
          description: "No players found for now. Try again later or change the time control. Sorry for the inconvenience.",
          duration: 5000, // Show for 5 seconds
        })
        setSelectedTime(null)
        setSelectedMode(null) // Also reset mode selection
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [matchmaking.status])

  const handleStartGame = () => {
    if (!selectedMode) return
    if (selectedMode === 'player') {
      setMatchmaking(prev => ({ ...prev, status: 'searching' }))
    }
    if (selectedMode === 'ai' && !selectedBot) return
    // Implement game start logic here
  }

  const renderModeSelection = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <Card 
        className={`p-6 bg-[#00ff9d]/10 border-2 cursor-pointer transition-all ${
          selectedMode === 'player' ? 'border-[#00ff9d]' : 'border-transparent hover:border-[#00ff9d]/50'
        }`}
        onClick={() => setSelectedMode('player')}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#00ff9d]/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-[#00ff9d]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Play vs Player</h3>
            <p className="text-gray-400">Challenge other players</p>
          </div>
        </div>
      </Card>

      <Card 
        className={`p-6 bg-[#00ff9d]/10 border-2 cursor-pointer transition-all ${
          selectedMode === 'ai' ? 'border-[#00ff9d]' : 'border-transparent hover:border-[#00ff9d]/50'
        }`}
        onClick={() => setSelectedMode('ai')}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#00ff9d]/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-[#00ff9d]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Play vs AI</h3>
            <p className="text-gray-400">Challenge the computer</p>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderTimeControls = () => (
    <Card className="p-6 bg-[#00ff9d]/10 border-0">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-[#00ff9d]" />
        <h2 className="text-xl font-semibold text-white">Time Controls</h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {timeControls.map((control) => (
          <button
            key={control.label}
            onClick={() => setSelectedTime(control)}
            className={`p-4 rounded-lg bg-black/20 border-2 transition-all ${
              selectedTime?.label === control.label 
                ? 'border-[#00ff9d]' 
                : 'border-transparent hover:border-[#00ff9d]/50'
            }`}
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{control.label}</p>
              <p className="text-sm text-[#00ff9d]">{control.type}</p>
            </div>
          </button>
        ))}
        <button 
          onClick={() => setShowCustomModal(true)}
          className="p-4 rounded-lg bg-black/20 border-2 border-transparent hover:border-[#00ff9d]/50"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-white">Custom</p>
            <p className="text-sm text-[#00ff9d]">Time</p>
          </div>
        </button>
      </div>
    </Card>
  )

  const renderBotSelection = () => (
    <Card className="p-6 bg-[#00ff9d]/10 border-0">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-5 h-5 text-[#00ff9d]" />
        <h2 className="text-xl font-semibold text-white">Select Bot</h2>
      </div>

      <div className="grid gap-4">
        {bots.map((bot) => (
          <button
            key={bot.id}
            onClick={() => setSelectedBot(bot)}
            className={`w-full p-4 rounded-lg bg-black/20 border-2 transition-all ${
              selectedBot?.id === bot.id 
                ? 'border-[#00ff9d]' 
                : 'border-transparent hover:border-[#00ff9d]/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-[#00ff9d]/20">
                <Image
                  src={bot.image}
                  alt={bot.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">{bot.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#00ff9d]" fill="currentColor" />
                    <span className="text-[#00ff9d]">{bot.rating}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-1">{bot.bio}</p>
                <span className="inline-block mt-2 px-2 py-1 rounded bg-[#00ff9d]/20 text-[#00ff9d] text-xs">
                  {bot.difficulty}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  )

  const renderCustomTimeModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-[#00ff9d]/10 border-0 flex flex-col max-h-[90vh]">
        {/* Fixed Header */}
        <div className="p-6 border-b border-white/10">
          <button
            onClick={() => setShowCustomModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-white">Custom Time Control</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-400">
                Time (minutes)
              </label>
              <div className="flex gap-2">
                <select
                  value={customTime.minutes}
                  onChange={(e) => setCustomTime({ ...customTime, minutes: parseInt(e.target.value) })}
                  className="flex-1 bg-black/20 border border-[#00ff9d]/20 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#00ff9d]/50"
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time} className="bg-gray-900">
                      {time} {time === 1 ? 'minute' : 'minutes'}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  min="1"
                  max="180"
                  value={customTime.minutes}
                  onChange={(e) => setCustomTime({ ...customTime, minutes: parseInt(e.target.value) || 1 })}
                  className="w-24 bg-black/20 border-[#00ff9d]/20 text-white"
                  placeholder="Custom"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-400">
                Increment (seconds)
              </label>
              <div className="flex gap-2">
                <select
                  value={customTime.increment}
                  onChange={(e) => setCustomTime({ ...customTime, increment: parseInt(e.target.value) })}
                  className="flex-1 bg-black/20 border border-[#00ff9d]/20 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#00ff9d]/50"
                >
                  {incrementOptions.map((inc) => (
                    <option key={inc} value={inc} className="bg-gray-900">
                      {inc} {inc === 1 ? 'second' : 'seconds'}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  min="0"
                  max="60"
                  value={customTime.increment}
                  onChange={(e) => setCustomTime({ ...customTime, increment: parseInt(e.target.value) || 0 })}
                  className="w-24 bg-black/20 border-[#00ff9d]/20 text-white"
                  placeholder="Custom"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-400">
                Game Format
              </label>
              <div className="grid gap-3">
                {gameFormats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setCustomTime({ ...customTime, format: format.id })}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      customTime.format === format.id
                        ? 'bg-[#00ff9d]/20 border-2 border-[#00ff9d]'
                        : 'bg-black/20 border-2 border-transparent hover:border-[#00ff9d]/50'
                    }`}
                  >
                    <div className="font-medium text-white">{format.name}</div>
                    <div className="text-sm text-gray-400 mt-1">{format.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-white/10">
          <Button
            onClick={() => {
              setSelectedTime({
                time: customTime.minutes,
                increment: customTime.increment,
                type: customTime.minutes <= 3 ? 'Bullet' : 
                       customTime.minutes <= 10 ? 'Blitz' : 
                       customTime.minutes <= 30 ? 'Rapid' : 'Classical',
                label: `${customTime.minutes}+${customTime.increment}`
              })
              setShowCustomModal(false)
            }}
            className="w-full bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black"
          >
            Apply Time Control
          </Button>
        </div>
      </Card>
    </div>
  )

  const formatRating = (rating: number, provisional: boolean) => {
    return `${rating}${provisional ? '?' : ''}`
  }

  const renderMatchmaking = () => (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        <div className="w-24 h-24 mx-auto relative">
          <div className="absolute inset-0 rounded-full border-4 border-[#00ff9d]/20" />
          <div 
            className="absolute inset-0 rounded-full border-4 border-[#00ff9d] border-t-transparent animate-spin"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Timer className="w-10 h-10 text-[#00ff9d]" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Searching...</h2>
          <div className="flex items-center justify-center gap-2 text-[#00ff9d]">
            <Search className="w-4 h-4" />
            <p>Rating Range: {matchmaking.ratingRange.min}-{matchmaking.ratingRange.max}</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-white">
            <p>Your Rating: {formatRating(userRating.rating, userRating.provisional)}</p>
          </div>
          <p className="text-xl font-mono text-white">
            {selectedTime?.label} • {Math.floor(matchmaking.timeElapsed / 60)}:
            {(matchmaking.timeElapsed % 60).toString().padStart(2, '0')}
          </p>
        </div>

        <Button
          onClick={() => {
            setMatchmaking({
              status: 'idle',
              timeElapsed: 0,
              ratingRange: {
                min: userRating.rating - 25,
                max: userRating.rating + 400
              }
            })
            setSelectedTime(null)
          }}
          variant="outline"
          className="border-[#00ff9d] text-[#00ff9d] hover:bg-[#00ff9d]/10"
        >
          Cancel
        </Button>
      </div>
    </div>
  )

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        <div className="flex items-center gap-4">
          {selectedMode && (
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedMode(null)
                setSelectedTime(null)
                setSelectedBot(null)
              }}
              className="text-[#00ff9d] hover:text-[#00ff9d]/80"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          )}
          <h1 className="text-2xl font-bold text-white">New Game</h1>
        </div>

        {!selectedMode && renderModeSelection()}
        {selectedMode === 'player' && renderTimeControls()}
        {selectedMode === 'ai' && renderBotSelection()}

        {((selectedMode === 'player' && selectedTime) || 
          (selectedMode === 'ai' && selectedBot)) && (
          <div className="flex justify-center">
            <Button
              onClick={handleStartGame}
              className="px-8 py-6 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-medium text-lg rounded-lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          </div>
        )}

        {matchmaking.status === 'searching' && renderMatchmaking()}

        {showCustomModal && renderCustomTimeModal()}
      </div>
    </AppShell>
  )
}

