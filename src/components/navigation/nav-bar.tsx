"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusCircle, MessageCircle, User, LogIn, UserPlus } from "lucide-react"

const navItems = [
  { icon: Home, path: "/dashboard" },
  { icon: Search, path: "/dashboard/search" },
  { icon: PlusCircle, path: "/dashboard/new-game" },
  { icon: MessageCircle, path: "/dashboard/chat" },
  { icon: User, path: "/dashboard/profile" },
  { icon: LogIn, path: "/login" },
  { icon: UserPlus, path: "/signup" },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 p-4">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map(({ icon: Icon, path }) => (
          <Link
            key={path}
            href={path}
            className={`w-12 h-12 rounded-full flex items-center justify-center
              ${path === "/new-game" ? "bg-[#00ff9d]" : "bg-[#00ff9d]/10"}
              ${pathname === path ? "text-[#00ff9d]" : "text-white"}`}
          >
            <Icon className="w-6 h-6" />
          </Link>
        ))}
      </div>
    </div>
  )
}

