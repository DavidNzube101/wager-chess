"use client"

import type React from "react"

import { useState } from "react"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AppShell } from "@/components/layout/app-shell"

export default function SearchPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate search
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Search</h1>

        <form onSubmit={handleSearch} className="relative mb-8">
          <Input
            type="search"
            placeholder="Search players or games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#00ff9d]/10 border-[#00ff9d]/20 text-white pl-12"
          />
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#00ff9d]" />
        </form>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Search results would go here */}
            <div className="h-32 rounded-lg bg-[#00ff9d]/10 animate-pulse" />
            <div className="h-32 rounded-lg bg-[#00ff9d]/10 animate-pulse" />
            <div className="h-32 rounded-lg bg-[#00ff9d]/10 animate-pulse" />
          </div>
        )}
      </div>
    </AppShell>
  )
}

