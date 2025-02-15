import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface Match {
  id: string
  type: string
  result: string
  user: {
    name: string
    image: string | null
  }
}

interface RecentMatchesProps {
  matches: Match[]
}

export function RecentMatches({ matches }: RecentMatchesProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-white text-sm">RECENT MATCHES</h2>
        <span className="text-[#00ff9d] text-sm">{matches.length}</span>
      </div>

      <div className="space-y-2">
        {matches.map((match) => (
          <Card key={match.id} className="bg-[#00ff9d]/10 border-0 p-3 rounded-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={match.user.image || undefined} />
                </Avatar>
                <span className="text-white text-sm">{match.type}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white text-sm">{match.user.name}</span>
                <span className={`text-xs ${match.result === "win" ? "text-[#00ff9d]" : "text-red-500"}`}>
                  {match.result}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

