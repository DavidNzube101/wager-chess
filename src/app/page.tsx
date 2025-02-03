import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { AppPreview } from "@/components/app-preview"

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <AppPreview />
      </main>
    </div>
  )
}

