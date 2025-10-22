"use client"

import { Sparkles } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI创作平台</h1>
              <p className="text-sm text-gray-400">智能生图与生视频工具</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              <span className="text-white font-medium">Beta</span> v1.0.0
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

