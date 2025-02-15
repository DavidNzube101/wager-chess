"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AppShell } from "@/components/layout/app-shell"

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")

  // Simulate loading
  setTimeout(() => setIsLoading(false), 1500)

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Chat</h1>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-[#00ff9d]/5 rounded-lg h-[calc(100vh-200px)] flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {/* Sample messages */}
              <div className="flex justify-end">
                <div className="bg-[#00ff9d] text-black rounded-lg px-4 py-2 max-w-[80%]">
                  Hey, want to play a game?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-[#00ff9d]/10 text-white rounded-lg px-4 py-2 max-w-[80%]">Let's set up a match.</div>
              </div>
            </div>

            <div className="p-4 border-t border-[#00ff9d]/10">
              <form className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-[#00ff9d]/10 border-[#00ff9d]/20 text-white"
                />
                <Button type="submit" className="bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90">
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

