"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageGenerator from "@/components/image-generator"
import VideoGenerator from "@/components/video-generator"
import GenerationList from "@/components/generation-list"
import Header from "@/components/header"

export default function Home() {
  const [generations, setGenerations] = useState<any[]>([])

  const handleNewGeneration = (generation: any) => {
    setGenerations([generation, ...generations])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧选项面板 */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <Tabs defaultValue="image" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="image">AI生图</TabsTrigger>
                <TabsTrigger value="video">AI生视频</TabsTrigger>
              </TabsList>
              
              <TabsContent value="image" className="mt-0">
                <ImageGenerator onGenerate={handleNewGeneration} />
              </TabsContent>
              
              <TabsContent value="video" className="mt-0">
                <VideoGenerator onGenerate={handleNewGeneration} />
              </TabsContent>
            </Tabs>
          </div>

          {/* 右侧生成列表 */}
          <div className="flex-1 min-w-0">
            <GenerationList generations={generations} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 py-6">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          <p>© 2025 AI创作平台. 基于 Next.js 14 + Tailwind CSS + shadcn/ui 构建</p>
        </div>
      </footer>
    </div>
  )
}

