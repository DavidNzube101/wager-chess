"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Calendar } from "lucide-react"

export default function SignUp() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [password, setPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        phoneNumber,
        birthDate,
        createdAt: new Date(),
      })

      await setDoc(doc(db, "wallets", user.uid), {
        balance: 0,
        createdAt: new Date(),
      })

      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message)
    }
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-200"
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-200"
            />
          </div>

          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200"
          />

          <div className="relative">
            <Input
              type="date"
              placeholder="Birth of date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Set Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>

          <div className="flex gap-4">
            <select className="px-4 py-3 rounded-lg border border-gray-200 bg-white w-24">
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+91">+91</option>
            </select>
            <Input
              type="tel"
              placeholder="(234) 567-8900"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200"
            />
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

