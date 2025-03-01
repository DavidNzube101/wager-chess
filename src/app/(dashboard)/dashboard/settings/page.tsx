"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { auth, db } from "@/lib/firebase"
import { doc, updateDoc, deleteDoc } from "firebase/firestore"
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth"
import { User, Trash2, Save } from "lucide-react"

export default function Settings() {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [password, setPassword] = useState("")
  const [userInfo, setUserInfo] = useState({
    username: auth.currentUser?.displayName || "",
    email: auth.currentUser?.email || "",
  })
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  })
  const { toast } = useToast()

  const handleUpdateInfo = async () => {
    try {
      const user = auth.currentUser
      if (!user) return

      await updateDoc(doc(db, "users", user.uid), {
        username: userInfo.username,
      })

      setIsEditing(false)
      toast({
        title: "Success",
        description: "Your information has been updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update information.",
      })
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser
      if (!user || !user.email) return

      // Reauthenticate user before deletion
      const credential = EmailAuthProvider.credential(user.email, password)
      await reauthenticateWithCredential(user, credential)

      // Delete Firestore data
      await deleteDoc(doc(db, "users", user.uid))
      await deleteDoc(doc(db, "wallets", user.uid))

      // Delete auth account
      await deleteUser(user)

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account. Please check your password.",
      })
    }
  }

  const handleUpdatePassword = async () => {
    try {
      const user = auth.currentUser
      if (!user || !user.email) return

      if (passwords.new !== passwords.confirm) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "New passwords don't match.",
        })
        return
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, passwords.current)
      await reauthenticateWithCredential(user, credential)

      // Update password
      await updatePassword(user, passwords.new)

      setPasswords({ current: "", new: "", confirm: "" })
      toast({
        title: "Success",
        description: "Your password has been updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password. Please check your current password.",
      })
    }
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>

        {/* User Information */}
        <Card className="p-6 bg-[#00ff9d]/10 border-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">User Information</h2>
            <Button
              variant="ghost"
              onClick={() => setIsEditing(!isEditing)}
              className="text-[#00ff9d] hover:bg-[#00ff9d]/10"
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Username
              </label>
              <Input
                value={userInfo.username}
                onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                disabled={!isEditing}
                className="bg-black/20 border-[#00ff9d]/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <Input
                value={userInfo.email}
                disabled
                className="bg-black/20 border-[#00ff9d]/20 text-white"
              />
            </div>

            {isEditing && (
              <Button
                onClick={handleUpdateInfo}
                className="w-full bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </Card>

        {/* Update Password */}
        <Card className="p-6 bg-[#00ff9d]/10 border-0">
          <h2 className="text-lg font-semibold text-white mb-4">Update Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Current Password
              </label>
              <Input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="bg-black/20 border-[#00ff9d]/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                New Password
              </label>
              <Input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="bg-black/20 border-[#00ff9d]/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="bg-black/20 border-[#00ff9d]/20 text-white"
              />
            </div>
            <Button
              onClick={handleUpdatePassword}
              className="w-full bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black"
            >
              <Save className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </div>
        </Card>

        {/* Delete Account */}
        <Card className="p-6 bg-red-500/10 border-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Delete Account</h2>
            <Button
              variant="ghost"
              onClick={() => setIsDeleting(!isDeleting)}
              className="text-red-500 hover:bg-red-500/10"
            >
              Delete Account
            </Button>
          </div>

          {isDeleting && (
            <div className="space-y-4">
              <p className="text-gray-400">
                This action cannot be undone. Please enter your password to confirm.
              </p>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-black/20 border-red-500/20 text-white"
              />
              <Button
                onClick={handleDeleteAccount}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Permanently Delete Account
              </Button>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  )
} 