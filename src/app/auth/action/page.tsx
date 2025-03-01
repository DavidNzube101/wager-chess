"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { applyActionCode } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Input } from "@/components/ui/input"

export default function AuthAction() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")
  const oobCode = searchParams.get("oobCode")

  useEffect(() => {
    const handleVerification = async () => {
      if (mode === "verifyEmail" && oobCode) {
        try {
          await applyActionCode(auth, oobCode)
          setStatus("success")
          setTimeout(() => {
            router.push("/login")
          }, 3000)
        } catch (error) {
          setStatus("error")
        }
      }
    }

    handleVerification()
  }, [mode, oobCode, router])

  return (
    <div className="min-h-screen bg-[url('https://images.pexels.com/photos/2695392/pexels-photo-2695392.jpeg')] bg-no-repeat bg-cover flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-lg text-center">
        {status === "loading" && <p className="text-gray-600">Verifying your email...</p>}
        {status === "success" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
            <p className="text-gray-600">Redirecting to login page...</p>
          </div>
        )}
        {status === "error" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
            <p className="text-gray-600">Please try again or contact support.</p>
          </div>
        )}
      </div>
    </div>
  )
} 