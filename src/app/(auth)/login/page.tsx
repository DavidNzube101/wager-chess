"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export default function Login() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      let email = identifier

      // Check if identifier is a username
      if (!identifier.includes('@')) {
        // Query Firestore to get email by username
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("username", "==", identifier))
        const querySnapshot = await getDocs(q)
        
        if (querySnapshot.empty) {
          throw new Error("User not found")
        }
        
        email = querySnapshot.docs[0].data().email
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      if (!user.emailVerified) {
        setError("Please verify your email before logging in.")
        return
      }

      router.push("/dashboard")
    } catch (error: any) {
      setError(
        error.message === "User not found"
          ? "Invalid username or password"
          : "Invalid email or password"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!identifier) {
      setError("Please enter your email address")
      return
    }

    try {
      await sendPasswordResetEmail(auth, identifier, {
        url: `${window.location.origin}/login`,
      })
      setResetEmailSent(true)
      setError("")
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-[url('https://images.pexels.com/photos/2695392/pexels-photo-2695392.jpeg')] bg-no-repeat bg-cover flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-600 mt-2">Sign in to your account</p>
          </div>
          <Link href="/signup" className="text-[#00ff9d] hover:underline text-sm font-medium">
            Sign Up
          </Link>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200"
            required
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-[#00ff9d]" />
              <label className="ml-2 text-sm text-gray-600">Remember me</label>
            </div>
            <button
              onClick={handleForgotPassword}
              className="text-sm text-[#00ff9d] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-medium py-3 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or Sign In With</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-2" />
            Google
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Image src="/facebook.svg" alt="Facebook" width={20} height={20} className="mr-2" />
            Facebook
          </button>
        </div>

        {error && <p className="mt-4 text-center text-red-500">{error}</p>}

        {resetEmailSent && (
          <div className="mt-4 p-4 bg-[#00ff9d]/10 rounded-lg">
            <p className="text-sm text-white">
              Password reset email sent! Check your inbox for instructions.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

