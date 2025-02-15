"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Eye, EyeOff } from "lucide-react"

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (loginMethod === "email") {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        // Implement phone authentication here
        const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`
        // You would typically use Firebase phone auth here
      }
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-600 mt-2">Login to access your account</p>
        </div>

        <Tabs defaultValue="phone" className="w-full" onValueChange={(v: string) => setLoginMethod(v as "phone" | "email")}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="phone">Phone Number</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>

          <form onSubmit={handleLogin} className="space-y-6">
            <TabsContent value="phone">
              <div className="space-y-4">
                <Input
                  type="tel"
                  placeholder="+1 (234) 567-8900"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200"
                />
              </div>
            </TabsContent>

            <TabsContent value="email">
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200"
                />
              </div>
            </TabsContent>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember" className="border-2 border-gray-200" />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-[#00ff9d] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-medium py-3 rounded-lg"
            >
              Log In
            </Button>
          </form>
        </Tabs>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or Sign In With</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-2" />
              Google
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Image src="/facebook.svg" alt="Facebook" width={20} height={20} className="mr-2" />
              Facebook
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#00ff9d] hover:underline font-medium">
            Sign Up
          </Link>
        </p>

        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  )
}

