"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { confirmPasswordReset } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const oobCode = searchParams.get("oobCode")

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!oobCode) {
      setError("Invalid password reset link")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword)
      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-[url('https://images.pexels.com/photos/2695392/pexels-photo-2695392.jpeg')] bg-no-repeat bg-cover flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-lg">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-sm text-gray-600 mt-2">
            Enter your new password below
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <p className="text-green-600">Password reset successful!</p>
            <p className="text-sm text-gray-600 mt-2">
              Redirecting to login page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-black/20 border-[#00ff9d]/20 text-white placeholder:text-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-black/20 border-[#00ff9d]/20 text-white placeholder:text-gray-400"
              required
            />

            <Button
              type="submit"
              className="w-full bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-medium py-3 rounded-lg"
            >
              Reset Password
            </Button>
          </form>
        )}

        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  )
} 