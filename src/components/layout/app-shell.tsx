"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusCircle, MessageCircle, User, Grid } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Search, label: "Search", href: "/dashboard/search" },
  { icon: PlusCircle, label: "New Game", href: "/dashboard/new-game" },
  { icon: MessageCircle, label: "Chat", href: "/dashboard/chat" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-black/50 border-r border-[#00ff9d]/10">
        <div className="flex flex-col w-full p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-[#00ff9d] text-2xl font-bold">Play it</h1>
            <div className="w-8 h-8 rounded-full bg-[#00ff9d]/10 flex items-center justify-center">
              <Grid className="w-5 h-5 text-[#00ff9d]" />
            </div>
          </div>
          <nav className="space-y-2">
            {navItems.map(({ icon: Icon, label, href }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  pathname === href ? "bg-[#00ff9d] text-black" : "text-white hover:bg-[#00ff9d]/10",
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:pl-64 min-h-screen">
        <main className="container mx-auto p-4">{children}</main>

        {/* Mobile Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/90 border-t border-[#00ff9d]/10">
          <div className="flex justify-around p-4">
            {navItems.map(({ icon: Icon, href }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  pathname === href ? "bg-[#00ff9d] text-black" : "bg-[#00ff9d]/10 text-white",
                )}
              >
                <Icon className="w-6 h-6" />
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}

