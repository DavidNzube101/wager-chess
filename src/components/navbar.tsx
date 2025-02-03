import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CastleIcon as ChessKnight } from "lucide-react"

export function Navbar() {
  return (
    <header className="fixed top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <ChessKnight className="h-8 w-8 text-[#00ff8c]" />
          <span className="text-xl font-bold">WagerChess</span>
        </div>
        <nav className="hidden gap-6 md:flex">
          <Link className="text-sm font-medium hover:text-[#00ff8c]" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-[#00ff8c]" href="#tournaments">
            Tournaments
          </Link>
          <Link className="text-sm font-medium hover:text-[#00ff8c]" href="#how-it-works">
            How It Works
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden sm:flex">
            Sign In
          </Button>
          <Button className="bg-[#00ff8c] text-black hover:bg-[#00ff8c]/90">Play Now</Button>
        </div>
      </div>
    </header>
  )
}

