"use client"

import { useState, useEffect, useRef } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { auth, db, storage } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useRouter } from "next/navigation"
import { User2, Mail, Calendar, Camera, Pencil } from "lucide-react"
import Image from "next/image"

interface UserData {
  username: string
  email: string
  createdAt: { toDate: () => Date }
  bio?: string
  photoURL?: string
}

interface WalletData {
  balance: number
  createdAt: { toDate: () => Date }
}

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [bio, setBio] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser
        if (!currentUser) {
          router.push('/login')
          return
        }

        // Fetch user data
        const userDocRef = doc(db, "users", currentUser.uid)
        const userDocSnap = await getDoc(userDocRef)
        
        if (userDocSnap.exists()) {
          const data = userDocSnap.data() as UserData
          setUserData({
            ...data,
            createdAt: data.createdAt
          })
          setBio(data.bio || "")
        }

        // Fetch wallet data
        const walletDocRef = doc(db, "wallets", currentUser.uid)
        const walletDocSnap = await getDoc(walletDocRef)
        
        if (walletDocSnap.exists()) {
          setWalletData({
            ...walletDocSnap.data() as WalletData,
            createdAt: walletDocSnap.data().createdAt.toDate()
          })
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !auth.currentUser) return

    try {
      setIsUploading(true)

      // Create a storage reference
      const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}/${file.name}`)
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file)
      
      // Get the download URL
      const photoURL = await getDownloadURL(snapshot.ref)

      // Update user document with new photo URL
      const userRef = doc(db, "users", auth.currentUser.uid)
      await updateDoc(userRef, { 
        photoURL: photoURL 
      })

      // Update local state
      setUserData(prev => prev ? { ...prev, photoURL } : null)
      
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleUpdateBio = async () => {
    if (!auth.currentUser) return

    try {
      const userRef = doc(db, "users", auth.currentUser.uid)
      await updateDoc(userRef, { bio })
      setUserData(prev => prev ? { ...prev, bio } : null)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating bio:", error)
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
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold text-white">Profile</h1>

        <Card className="p-6 bg-[#00ff9d]/10 border-0">
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {userData?.photoURL ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <Image
                      src={userData.photoURL}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#00ff9d]/20 flex items-center justify-center">
                    <User2 className="w-10 h-10 text-[#00ff9d]" />
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90 disabled:opacity-50"
                >
                  {isUploading ? (
                    <LoadingSpinner className="w-4 h-4" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{userData?.username}</h2>
                <p className="text-gray-400">Balance: ₦{walletData?.balance.toLocaleString()}</p>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Bio</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-[#00ff9d] hover:text-[#00ff9d]/80"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write something about yourself..."
                    className="bg-black/20 border-[#00ff9d]/20 text-white placeholder:text-gray-400"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="text-gray-400 border-gray-400"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateBio}
                      className="bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">{userData?.bio || "No bio added yet"}</p>
              )}
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5" />
                <span>{userData?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Calendar className="w-5 h-5" />
                <span>Member since {userData?.createdAt.toDate().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Account Status */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Account Status</span>
                <span className="text-[#00ff9d]">Active</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-400">Email Verification</span>
                <span className={auth.currentUser?.emailVerified ? "text-[#00ff9d]" : "text-yellow-500"}>
                  {auth.currentUser?.emailVerified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Game Statistics */}
        <Card className="p-6 bg-[#00ff9d]/10 border-0">
          <h3 className="text-lg font-semibold text-white mb-4">Game Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-black/20 rounded-lg">
              <p className="text-gray-400">Total Games</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
            <div className="p-4 bg-black/20 rounded-lg">
              <p className="text-gray-400">Win Rate</p>
              <p className="text-2xl font-bold text-white">0%</p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

