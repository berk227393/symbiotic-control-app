"use client"

import { useState } from "react"
import { ArrowLeft, ShoppingBag, Star, Zap, Crown, Sparkles } from "lucide-react"
import Link from "next/link"

interface StoreItem {
  id: string
  name: string
  description: string
  price: number
  category: "clothing" | "animation" | "voice" | "premium"
  rarity: "common" | "rare" | "epic" | "legendary"
  image: string
  owned: boolean
}

const storeItems: StoreItem[] = [
  {
    id: "1",
    name: "Cyber Jacket",
    description: "Futuristic neon-lit jacket with animated circuits",
    price: 150,
    category: "clothing",
    rarity: "rare",
    image: "/placeholder.svg?height=120&width=120",
    owned: false,
  },
  {
    id: "2",
    name: "Holographic Aura",
    description: "Shimmering holographic effect around your agent",
    price: 300,
    category: "animation",
    rarity: "epic",
    image: "/placeholder.svg?height=120&width=120",
    owned: false,
  },
  {
    id: "3",
    name: "Robotic Voice Pack",
    description: "Mechanical voice modulation with echo effects",
    price: 100,
    category: "voice",
    rarity: "common",
    image: "/placeholder.svg?height=120&width=120",
    owned: true,
  },
  {
    id: "4",
    name: "Dragon Wings",
    description: "Majestic animated dragon wings with particle effects",
    price: 500,
    category: "clothing",
    rarity: "legendary",
    image: "/placeholder.svg?height=120&width=120",
    owned: false,
  },
  {
    id: "5",
    name: "Matrix Rain",
    description: "Iconic green code rain animation background",
    price: 200,
    category: "animation",
    rarity: "rare",
    image: "/placeholder.svg?height=120&width=120",
    owned: false,
  },
  {
    id: "6",
    name: "Premium Voice AI",
    description: "Ultra-realistic voice synthesis with emotion",
    price: 1000,
    category: "premium",
    rarity: "legendary",
    image: "/placeholder.svg?height=120&width=120",
    owned: false,
  },
  {
    id: "7",
    name: "Steampunk Goggles",
    description: "Victorian-era goggles with brass details",
    price: 80,
    category: "clothing",
    rarity: "common",
    image: "/placeholder.svg?height=120&width=120",
    owned: false,
  },
  {
    id: "8",
    name: "Particle Storm",
    description: "Swirling particle effects with color transitions",
    price: 250,
    category: "animation",
    rarity: "epic",
    image: "/placeholder.svg?height=120&width=120",
    owned: false,
  },
]

const categories = [
  { id: "all", name: "All Items", icon: ShoppingBag },
  { id: "clothing", name: "Clothing", icon: Crown },
  { id: "animation", name: "Animations", icon: Sparkles },
  { id: "voice", name: "Voice", icon: Zap },
  { id: "premium", name: "Premium", icon: Star },
]

const rarityColors = {
  common: "border-gray-500 bg-gray-500/10",
  rare: "border-blue-500 bg-blue-500/10",
  epic: "border-purple-500 bg-purple-500/10",
  legendary: "border-yellow-500 bg-yellow-500/10",
}

const rarityLabels = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
}

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [credits] = useState(1000) // Mock credits from store

  const filteredItems = storeItems.filter((item) => selectedCategory === "all" || item.category === selectedCategory)

  const handlePurchase = (item: StoreItem) => {
    if (item.owned) return
    if (credits < item.price) {
      alert("Insufficient credits!")
      return
    }

    // Mock purchase
    alert(`Successfully purchased ${item.name}! (This is a demo - no actual purchase made)`)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <ShoppingBag size={24} />
        <div className="flex-1">
          <h1 className="font-semibold">Agent Store</h1>
          <p className="text-sm text-gray-400">Items & Clothing</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Credits</div>
          <div className="font-bold text-yellow-400">{credits.toLocaleString()}</div>
        </div>
      </header>

      {/* Categories */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Icon size={16} />
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Items Grid */}
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-gray-900 rounded-xl p-4 border-2 transition-all hover:scale-105 ${
                  rarityColors[item.rarity]
                }`}
              >
                {/* Item Image */}
                <div className="aspect-square bg-gray-800 rounded-lg mb-3 overflow-hidden">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Item Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.rarity === "common"
                          ? "bg-gray-600"
                          : item.rarity === "rare"
                            ? "bg-blue-600"
                            : item.rarity === "epic"
                              ? "bg-purple-600"
                              : "bg-yellow-600"
                      }`}
                    >
                      {rarityLabels[item.rarity]}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="font-bold text-yellow-400">{item.price} credits</div>

                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={item.owned}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                        item.owned
                          ? "bg-green-600 text-white cursor-not-allowed"
                          : credits >= item.price
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {item.owned ? "Owned" : credits >= item.price ? "Buy" : "Insufficient"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
              <p>No items found in this category.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
