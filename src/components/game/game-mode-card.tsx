import { Card } from "@/components/ui/card"
import { ChevronRight, type LucideIcon } from "lucide-react"

interface GameModeCardProps {
  icon: LucideIcon
  title: string
  subtitle: string
  status: string
}

export function GameModeCard({ icon: Icon, title, subtitle, status }: GameModeCardProps) {
  return (
    <Card className="bg-[#00ff9d]/10 border-0 p-4 rounded-xl">
      <div className="flex flex-col h-full justify-between">
        <div className="space-y-2">
          <Icon className="w-6 h-6 text-[#00ff9d] mb-2" />
          <h3 className="text-white text-sm">{title}</h3>
          <p className="text-[#00ff9d] text-xs">{subtitle}</p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-white/60 text-xs">{status}</span>
          <ChevronRight className="w-4 h-4 text-[#00ff9d]" />
        </div>
      </div>
    </Card>
  )
}

