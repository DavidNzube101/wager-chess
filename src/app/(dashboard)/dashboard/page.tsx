"use client"

import { useState, useEffect } from "react"
import { Grid, Users, BotIcon, User2 } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Card } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, collection, query, limit, getDocs, orderBy } from "firebase/firestore"
import { useRouter } from "next/navigation"

interface UserData {
  username: string
  email: string
  createdAt: Date
}

interface WalletData {
  balance: number
  createdAt: Date
}

interface MatchData {
  opponent: string
  result: 'win' | 'loss' | 'draw'
  date: Date
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [recentMatches, setRecentMatches] = useState<MatchData[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser
        if (!currentUser) {
          router.push('/login')
          return
        }

        // Fetch user and wallet data
        const [userDoc, walletDoc] = await Promise.all([
          getDoc(doc(db, "users", currentUser.uid)),
          getDoc(doc(db, "wallets", currentUser.uid))
        ])

        if (userDoc.exists()) {
          setUserData({
            ...userDoc.data() as UserData,
            createdAt: userDoc.data().createdAt.toDate()
          })
        }

        if (walletDoc.exists()) {
          setWalletData({
            ...walletDoc.data() as WalletData,
            createdAt: walletDoc.data().createdAt.toDate()
          })
        }

        // Fetch recent matches (if you have a matches collection)
        const matchesQuery = query(
          collection(db, `users/${currentUser.uid}/matches`),
          orderBy('date', 'desc'),
          limit(5)
        )
        
        const matchesSnapshot = await getDocs(matchesQuery)
        const matches = matchesSnapshot.docs.map(doc => ({
          ...doc.data(),
          date: doc.data().date.toDate()
        })) as MatchData[]
        
        setRecentMatches(matches)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      </AppShell>
    )
  }

  const renderStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4 bg-[#00ff9d]/10 border-0">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#00ff9d]" />
          <span className="text-gray-400">Friends Online</span>
        </div>
        <p className="text-2xl font-bold text-white mt-2">0</p>
      </Card>
      <Card className="bg-[#00ff9d]/10 border-0 p-6">
        <Grid className="w-8 h-8 text-[#00ff9d] mb-4" />
        <p className="text-3xl font-bold text-white">₦{walletData?.balance.toLocaleString()}</p>
        <p className="text-[#00ff9d]">Balance</p>
      </Card>

      <Card className="bg-[#00ff9d]/10 border-0 p-6">
        <BotIcon className="w-8 h-8 text-[#00ff9d] mb-4" />
        <p className="text-3xl font-bold text-white">0</p>
        <p className="text-[#00ff9d]">AI Matches</p>
      </Card>

      <Card className="bg-[#00ff9d]/10 border-0 p-6">
        <User2 className="w-8 h-8 text-[#00ff9d] mb-4" />
        <p className="text-3xl font-bold text-white">0</p>
        <p className="text-[#00ff9d]">Player Matches</p>
      </Card>
    </div>
  )

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats Grid */}
        {renderStats()}

        {/* Recent Activity */}
        <Card className="bg-[#00ff9d]/10 border-0 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          {recentMatches.length > 0 ? (
            <div className="space-y-4">
              {recentMatches.map((match, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00ff9d]/20 flex items-center justify-center">
                      <User2 className="w-5 h-5 text-[#00ff9d]" />
                    </div>
                    <div>
                      <p className="text-white">vs {match.opponent}</p>
                      <p className="text-sm text-gray-400">
                        {match.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-${match.result === 'win' ? '[#00ff9d]' : 'red-500'}`}>
                    {match.result.charAt(0).toUpperCase() + match.result.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No recent matches found.</p>
          )}
        </Card>
      </div>
    </AppShell>
  )
}

