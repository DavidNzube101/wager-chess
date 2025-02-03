import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export function AppPreview() {
  return (
    <section className="container py-24 sm:py-32">
      <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
        <Image
          src="https://placehold.co/800x600"
          alt="WagerChess App Interface"
          width={800}
          height={600}
          className="rounded-lg shadow-2xl"
          priority
        />
        <div className="flex flex-col items-start gap-4 lg:max-w-[45%]">
          <Badge variant="outline" className="border-[#00ff8c] text-[#00ff8c]">
            Modern Design
          </Badge>
          <h2 className="text-3xl font-bold sm:text-5xl">Experience Chess Like Never Before</h2>
          <p className="text-muted-foreground sm:text-xl">
            Our sleek, intuitive interface puts everything you need at your fingertips. Challenge opponents, track your
            progress, and manage your matches with ease.
          </p>
          <ul className="grid gap-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-[#00ff8c]">•</span> Multiple game modes including Blitz, Bullet, and Standard
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#00ff8c]">•</span> Real-time match tracking and statistics
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#00ff8c]">•</span> Integrated chat and social features
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#00ff8c]">•</span> Easy-to-use challenge system
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

