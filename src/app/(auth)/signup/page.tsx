"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Mail } from "lucide-react"

export default function SignUp() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await setDoc(doc(db, "users", user.uid), {
        username,
        usernameLower: username.toLowerCase(),
        email,
        createdAt: new Date(),
        emailVerified: false
      })

      await setDoc(doc(db, "wallets", user.uid), {
        balance: 0,
        createdAt: new Date(),
      })

      await sendEmailVerification(user, {
        url: `${window.location.origin}/auth/action`,
        handleCodeInApp: false,
      })

      setVerificationSent(true)

    } catch (error: any) {
      setError(error.message)
    }
  }

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-[url('https://images.pexels.com/photos/2695392/pexels-photo-2695392.jpeg')] bg-no-repeat bg-cover flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-lg">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-[#00ff9d]/10 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-[#00ff9d]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
              <p className="text-sm text-gray-600 mt-2">
                We've sent a verification link to <span className="font-medium">{email}</span>
              </p>
            </div>
            <div className="text-sm text-gray-500 max-w-sm">
              Click the link in the email to verify your account. If you don't see the email, check your spam folder.
            </div>
            <div className="pt-4 space-y-4 w-full">
              <Button
                onClick={() => window.location.href = "https://mail.google.com"}
                className="w-full bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-medium py-3 rounded-lg"
              >
                Open Gmail
              </Button>
              <Button
                onClick={() => router.push('/login')}
                variant="outline"
                className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-3 rounded-lg"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[url('https://images.pexels.com/photos/2695392/pexels-photo-2695392.jpeg')] bg-no-repeat bg-cover flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Get Started Now</h2>
            <p className="text-sm text-gray-600 mt-2">Create an account or log in to explore about our app</p>
          </div>
          <Link href="/login" className="text-[#00ff9d] hover:underline text-sm font-medium">
            Log In
          </Link>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-black/20 border-[#00ff9d]/20 text-white placeholder:text-gray-400"
            required
          />

          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200"
            required
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Set Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-medium py-3 rounded-lg"
          >
            Sign Up
          </Button>
        </form>

        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  )
}

