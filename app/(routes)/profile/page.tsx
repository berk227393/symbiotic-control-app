"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, User, Edit3, Save, Camera, Award, BarChart3 } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  displayName: string
  bio: string
  avatar: string
  joinDate: string
  stats: {
    totalChats: number
    totalVoiceMinutes: number
    totalCreditsSpent: number
    itemsOwned: number
  }
  achievements: string[]
}

const defaultProfile: UserProfile = {
  displayName: "Agent User",
  bio: "AI enthusiast exploring the future of human-AI interaction",
  avatar: "/placeholder.svg?height=120&width=120",
  joinDate: new Date().toISOString(),
  stats: {
    totalChats: 0,
    totalVoiceMinutes: 0,
    totalCreditsSpent: 0,
    itemsOwned: 1,
  },
  achievements: [],
}

const availableAchievements = [
  { id: "first_chat", name: "First Contact", description: "Send your first message", icon: "💬" },
  { id: "voice_user", name: "Voice Pioneer", description: "Use voice features 10 times", icon: "🎤" },
  { id: "big_spender", name: "Big Spender", description: "Spend 500 credits in store", icon: "💰" },
  { id: "collector", name: "Collector", description: "Own 5 store items", icon: "🏆" },
  { id: "chatterbox", name: "Chatterbox", description: "Send 100 messages", icon: "💭" },
  { id: "early_adopter", name: "Early Adopter", description: "Join the beta program", icon: "⭐" },
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({ displayName: "", bio: "" })

  // Load profile from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("agent-user-profile")
    if (saved) {
      try {
        const parsedProfile = JSON.parse(saved)
        setProfile({ ...defaultProfile, ...parsedProfile })
      } catch (error) {
        console.error("Failed to load profile:", error)
      }
    } else {
      // Set join date for new users
      const newProfile = { ...defaultProfile, joinDate: new Date().toISOString() }
      setProfile(newProfile)
      localStorage.setItem("agent-user-profile", JSON.stringify(newProfile))
    }
  }, [])

  const startEditing = () => {
    setEditForm({
      displayName: profile.displayName,
      bio: profile.bio,
    })
    setIsEditing(true)
  }

  const saveProfile = async () => {
    setIsSaving(true)

    try {
      const updatedProfile = {
        ...profile,
        displayName: editForm.displayName,
        bio: editForm.bio,
      }

      localStorage.setItem("agent-user-profile", JSON.stringify(updatedProfile))
      setProfile(updatedProfile)
      setIsEditing(false)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditForm({ displayName: "", bio: "" })
  }

  const earnedAchievements = availableAchievements.filter((achievement) =>
    profile.achievements.includes(achievement.id),
  )

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <User size={24} />
        <div className="flex-1">
          <h1 className="font-semibold">Profile</h1>
          <p className="text-sm text-gray-400">User Settings</p>
        </div>
        {!isEditing && (
          <button
            onClick={startEditing}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Edit Profile"
          >
            <Edit3 size={20} />
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Card */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 bg-gray-700 rounded-full overflow-hidden">
                  <img src={profile.avatar || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                {isEditing && (
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Camera size={12} />
                  </button>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-3">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Display Name"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                      placeholder="Bio"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveProfile}
                        disabled={isSaving}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={14} />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{profile.displayName}</h2>
                    <p className="text-gray-300">{profile.bio}</p>
                    <p className="text-sm text-gray-400">Joined {new Date(profile.joinDate).toLocaleDateString()}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={20} />
              <h3 className="font-semibold">Statistics</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{profile.stats.totalChats}</div>
                <div className="text-sm text-gray-400">Total Chats</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{profile.stats.totalVoiceMinutes}</div>
                <div className="text-sm text-gray-400">Voice Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{profile.stats.totalCreditsSpent}</div>
                <div className="text-sm text-gray-400">Credits Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{profile.stats.itemsOwned}</div>
                <div className="text-sm text-gray-400">Items Owned</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award size={20} />
              <h3 className="font-semibold">Achievements</h3>
              <span className="text-sm text-gray-400">
                ({earnedAchievements.length}/{availableAchievements.length})
              </span>
            </div>

            {earnedAchievements.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <Award size={48} className="mx-auto mb-4 opacity-50" />
                <p>No achievements yet. Start using the app to earn them!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {earnedAchievements.map((achievement) => (
                  <div key={achievement.id} className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <div className="font-semibold text-sm">{achievement.name}</div>
                      <div className="text-xs text-gray-400">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Locked Achievements */}
            {availableAchievements.length > earnedAchievements.length && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Locked Achievements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableAchievements
                    .filter((achievement) => !profile.achievements.includes(achievement.id))
                    .slice(0, 4)
                    .map((achievement) => (
                      <div
                        key={achievement.id}
                        className="bg-gray-800/50 rounded-lg p-3 flex items-center gap-3 opacity-60"
                      >
                        <div className="text-2xl grayscale">🔒</div>
                        <div>
                          <div className="font-semibold text-sm text-gray-400">{achievement.name}</div>
                          <div className="text-xs text-gray-500">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
