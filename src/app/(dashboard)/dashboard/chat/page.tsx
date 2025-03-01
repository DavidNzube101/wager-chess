"use client"

import { useState, useEffect, useRef } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { auth, db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp, where, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { User2, Clock, Send, Circle } from "lucide-react"

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  createdAt: Timestamp
  receiverId?: string
}

interface User {
  id: string
  username: string
  email: string
  lastSeen: Timestamp
  isOnline: boolean
}

export default function Chat() {
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Update user's online status
  useEffect(() => {
    const currentUser = auth.currentUser
    if (!currentUser) return

    const userRef = doc(db, "users", currentUser.uid)
    setDoc(userRef, {
      isOnline: true,
      lastSeen: serverTimestamp()
    }, { merge: true })

    // Update when user leaves
    const handleUnload = () => {
      setDoc(userRef, {
        isOnline: false,
        lastSeen: serverTimestamp()
      }, { merge: true })
    }

    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      handleUnload()
    }
  }, [])

  // Fetch online users
  useEffect(() => {
    const currentUser = auth.currentUser
    if (!currentUser) return

    // Get chats where you're either the sender or receiver
    const q = query(
      collection(db, "chats"),
      where('participants', 'array-contains', currentUser.uid)
    )
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatMessages = snapshot.docs.map(doc => doc.data())
      
      // Get unique user IDs from messages
      const uniqueUserIds = new Set<string>()
      chatMessages.forEach(msg => {
        if (msg.senderId !== currentUser.uid) uniqueUserIds.add(msg.senderId)
        if (msg.receiverId !== currentUser.uid) uniqueUserIds.add(msg.receiverId)
      })

      if (uniqueUserIds.size === 0) {
        setUsers([])
        return
      }

      // Fetch user details for each unique user
      const userDocs = await Promise.all(
        Array.from(uniqueUserIds).map(userId => 
          getDoc(doc(db, "users", userId))
        )
      )

      const userList = userDocs
        .filter(doc => doc.exists())
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as User))

      setUsers(userList)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      router.push('/login')
      return
    }

    // Only fetch direct messages (no global chat)
    const q = query(
      collection(db, "chats"),
      where('receiverId', '==', currentUser.uid),
      orderBy("createdAt", "asc")
    )

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ChatMessage[]
        
        setMessages(newMessages)
        // Don't set loading to false immediately for empty messages
        if (newMessages.length > 0) {
          setIsLoading(false)
          scrollToBottom()
        }
      },
      (error) => {
        console.error("Error fetching messages:", error)
        setIsLoading(false)
      }
    )

    // Show loading for 3 seconds before showing "No Chats Started"
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 9000)

    return () => {
      unsubscribe()
      clearTimeout(timeout)
    }
  }, [router, selectedUser])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return

    const currentUser = auth.currentUser
    if (!currentUser) return

    try {
      await addDoc(collection(db, "chats"), {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email?.split('@')[0],
        message: newMessage.trim(),
        createdAt: Timestamp.now(),
        receiverId: selectedUser,
        participants: [currentUser.uid, selectedUser]
      })

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto p-4 flex gap-6">
        {/* User List */}
        <Card className="w-64 bg-[#00ff9d]/10 border-0 p-4 hidden md:block">
          <h2 className="text-white font-bold mb-4">Chats</h2>
          <div className="space-y-2">
            {users.length > 0 ? (
              users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user.id)}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                    selectedUser === user.id ? 'bg-[#00ff9d]/20' : 'hover:bg-black/20'
                  }`}
                >
                  <Circle 
                    className={`w-2 h-2 ${user.isOnline ? 'text-[#00ff9d]' : 'text-gray-400'}`} 
                    fill="currentColor" 
                  />
                  <span className="text-white truncate">{user.username || user.email?.split('@')[0]}</span>
                </button>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm">No chats available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Chat Area */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              {selectedUser ? `Chat with ${users.find(u => u.id === selectedUser)?.username || 'User'}` : 'Global Chat'}
            </h1>
            {selectedUser && (
              <Button
                onClick={() => setSelectedUser(null)}
                variant="outline"
                className="text-[#00ff9d] border-[#00ff9d]/20 hover:bg-[#00ff9d]/10"
              >
                Return to Global Chat
              </Button>
            )}
          </div>

          <Card className="bg-[#00ff9d]/10 border-0 p-6 flex flex-col h-[calc(100vh-200px)]">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {!isLoading && messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[#00ff9d]/20 flex items-center justify-center mx-auto mb-4">
                    <User2 className="w-8 h-8 text-[#00ff9d]" />
                  </div>
                  <h3 className="text-white font-medium">No Chats Started</h3>
                  <p className="text-gray-400 mt-1">Start a conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-4 p-4 rounded-lg ${
                        message.senderId === auth.currentUser?.uid
                          ? 'bg-[#00ff9d]/20 ml-auto'
                          : 'bg-black/20'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#00ff9d]/20 flex items-center justify-center flex-shrink-0">
                        <User2 className="w-5 h-5 text-[#00ff9d]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[#00ff9d] font-medium">{message.senderName}</p>
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {message.createdAt.toDate().toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-white mt-1 break-words">{message.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-black/20 border-[#00ff9d]/20 text-white placeholder:text-gray-400"
              />
              <Button 
                type="submit"
                className="bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

