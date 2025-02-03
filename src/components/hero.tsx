import { Button } from "@/components/ui/button"
import { Trophy, Users, Shield } from "lucide-react"

export function Hero() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px]" />
      <div className="container relative flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold sm:text-6xl md:text-7xl">
            Where Chess Meets{" "}
            <span className="bg-gradient-to-r from-[#00ff8c] to-[#00ff8c]/70 bg-clip-text text-transparent">
              Stakes
            </span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Play chess for real money. Challenge opponents, join tournaments, and prove your skills in a secure
            environment with live matches and fair play monitoring.
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button size="lg" className="bg-[#00ff8c] text-black hover:bg-[#00ff8c]/90">
            Start Playing
          </Button>
          <Button size="lg" variant="outline">
            Watch Matches
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[#00ff8c]" />
            <span>$100K+ Prize Pool</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#00ff8c]" />
            <span>10K+ Active Players</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#00ff8c]" />
            <span>Fair Play Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

