import { Clock, Video, Mic, Trophy, Users, Bell, CreditCard, Vote, Shield } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Customizable Match Settings",
    description: "Set your own time controls and divisions. Play the way you want with stakes that match your level.",
  },
  {
    icon: Video,
    title: "Live Match Viewing",
    description:
      "Watch matches in real-time with integrated webcam support. Feel the tension as players battle it out.",
  },
  {
    icon: Mic,
    title: "Audio Commentary",
    description: "Listen to live commentary or provide your own. Engage with the community through live interactions.",
  },
  {
    icon: Trophy,
    title: "Tournament System",
    description: "Join or spectate high-stakes tournaments. Compete for glory and substantial prize pools.",
  },
  {
    icon: Users,
    title: "Rich User Interaction",
    description: "Challenge players, customize your profile, and create your own chess community channels.",
  },
  {
    icon: Bell,
    title: "Real-time Updates",
    description: "Never miss a move with instant notifications for challenges, tournament starts, and game results.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Integrated payment system for tournament registration and match stakes. Quick and secure payouts.",
  },
  {
    icon: Vote,
    title: "Community Engagement",
    description: "Participate in polls and voting. Help shape the future of the platform and upcoming tournaments.",
  },
  {
    icon: Shield,
    title: "Fair Play System",
    description: "Advanced anti-cheating measures ensure all matches are fair and competitive.",
  },
]

export function Features() {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <div className="mb-16 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold sm:text-5xl">Everything You Need to Win</h2>
        <p className="mt-4 max-w-[85%] text-muted-foreground sm:text-xl">
          WagerChess combines competitive chess with cutting-edge features to deliver the ultimate online chess
          experience.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-full flex-col justify-between rounded-md p-6">
              <feature.icon className="h-12 w-12 text-[#00ff8c]" />
              <div className="space-y-2">
                <h3 className="font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

