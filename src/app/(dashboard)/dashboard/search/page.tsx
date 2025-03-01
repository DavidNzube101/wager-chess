"use client"

import { useState, useEffect } from "react"
import { SearchIcon, Users, Zap, Clock, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AppShell } from "@/components/layout/app-shell"
import { Card } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore"
import Image from "next/image"

type SearchResult = {
  id: string
  type: 'user' | 'channel'
  username?: string
  displayName?: string
  profilePic?: string
  rating?: {
    blitz: number
    rapid: number
    bullet: number
    daily: number
  }
  country?: string
  joinedAt?: Date
  channelName?: string
  members?: number
}

export default function SearchPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchResult[]>([])
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const searchUsers = async (searchText: string) => {
    if (searchText.length < 2) {
      setSuggestions([])
      return
    }

    try {
      const usersRef = collection(db, "users")
      const queryText = searchText.toLowerCase()
      
      // Search by lowercase username
      const userQuery = query(usersRef, 
        where("usernameLower", ">=", queryText),
        where("usernameLower", "<=", queryText + "\uf8ff"),
        limit(5)
      )

      const userSnap = await getDocs(userQuery)
      
      const results: SearchResult[] = userSnap.docs.map(doc => ({
        id: doc.id,
        type: 'user',
        username: doc.data().username,
        profilePic: doc.data().profilePic,
        rating: doc.data().rating,
        country: doc.data().country,
        joinedAt: doc.data().createdAt?.toDate(),
      }))

      setSuggestions(results)
      setShowSuggestions(true)
    } catch (error) {
      console.error("Search error:", error)
      setSuggestions([])
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery) return

    setIsLoading(true)
    await searchUsers(searchQuery)
    setIsLoading(false)
  }

  const renderUserProfile = (user: SearchResult) => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-[#00ff9d]/10">
          <Image
            src={user.profilePic || "/default-avatar.png"}
            alt={user.username || ""}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{user.username}</h2>
          <div className="flex items-center gap-2 text-gray-400">
            <Image
              src={`/flags/${user.country?.toLowerCase() || 'un'}.svg`}
              alt={user.country || ""}
              width={20}
              height={15}
              className="rounded"
            />
            <span>{user.country}</span>
          </div>
          <p className="text-sm text-gray-400">
            Joined {user.joinedAt?.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#00ff9d]/10 border-0">
          <div className="flex flex-col items-center">
            <Zap className="w-6 h-6 text-[#00ff9d] mb-2" />
            <p className="text-2xl font-bold text-white">{user.rating?.blitz || 0}</p>
            <p className="text-sm text-[#00ff9d]">Blitz</p>
          </div>
        </Card>
        <Card className="p-4 bg-[#00ff9d]/10 border-0">
          <div className="flex flex-col items-center">
            <Clock className="w-6 h-6 text-[#00ff9d] mb-2" />
            <p className="text-2xl font-bold text-white">{user.rating?.rapid || 0}</p>
            <p className="text-sm text-[#00ff9d]">Rapid</p>
          </div>
        </Card>
        {/* Add Bullet and Daily cards similarly */}
      </div>
    </div>
  )

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Search</h1>

        <div className="relative">
          <form onSubmit={handleSearch} className="relative mb-8">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                searchUsers(e.target.value)
              }}
              placeholder="Search players or channels"
              className="bg-black/20 border-[#00ff9d]/20 text-white placeholder:text-gray-400 pl-12"
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#00ff9d]" />
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute w-full bg-black/90 border border-[#00ff9d]/20 rounded-lg mt-2 shadow-lg z-10">
              {suggestions.map((result) => (
                <button
                  key={result.id}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#00ff9d]/10 text-left"
                  onClick={() => {
                    setSelectedResult(result)
                    setShowSuggestions(false)
                    setSearchQuery("")
                  }}
                >
                  {result.type === 'user' ? (
                    <Users className="w-5 h-5 text-[#00ff9d]" />
                  ) : (
                    <MessageCircle className="w-5 h-5 text-[#00ff9d]" />
                  )}
                  <div>
                    <p className="text-white">
                      {result.type === 'user' ? result.username : result.channelName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {result.type === 'user' ? 'Player' : 'Channel'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : selectedResult ? (
          selectedResult.type === 'user' ? (
            renderUserProfile(selectedResult)
          ) : (
            <Card className="p-6 bg-[#00ff9d]/10 border-0">
              <h2 className="text-xl font-bold text-white">{selectedResult.channelName}</h2>
              <p className="text-gray-400">{selectedResult.members} members</p>
            </Card>
          )
        ) : searchQuery && !suggestions.length && (
          <p className="text-center text-gray-400">No results found</p>
        )}
      </div>
    </AppShell>
  )
}

