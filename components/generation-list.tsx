"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, Image as ImageIcon, Video } from "lucide-react"
import MediaPreview from "@/components/media-preview"

interface Generation {
  id: string
  type: "image" | "video"
  mode: string
  model: string
  prompt: string
  url: string
  thumbnail?: string
  timestamp: Date
  aspectRatio?: string
  steps?: number
  duration?: number
}

interface GenerationListProps {
  generations: Generation[]
}

export default function GenerationList({ generations }: GenerationListProps) {
  const [selectedMedia, setSelectedMedia] = useState<Generation | null>(null)

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("下载失败:", error)
    }
  }

  if (generations.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 h-full min-h-[600px] flex items-center justify-center">
        <CardContent className="text-center">
          <div className="text-gray-400 text-lg mb-2">暂无生成内容</div>
          <div className="text-gray-500 text-sm">请在左侧选择生成类型并开始创作</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white">生成历史</h2>
            <p className="text-gray-300 text-sm">共 {generations.length} 个作品</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generations.map((generation) => (
              <div
                key={generation.id}
                className="group relative bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-200 border border-white/10"
              >
                {/* 缩略图 */}
                <div className="relative aspect-video overflow-hidden bg-gray-800">
                  {generation.type === "image" ? (
                    <img
                      src={generation.url}
                      alt={generation.prompt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={generation.thumbnail || generation.url}
                        alt={generation.prompt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Video className="w-12 h-12 text-white opacity-80" />
                      </div>
                    </div>
                  )}

                  {/* 悬停操作按钮 */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => setSelectedMedia(generation)}
                      className="bg-white/20 hover:bg-white/30 border-white/30"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() =>
                        handleDownload(
                          generation.url,
                          `${generation.type}-${generation.id}.${
                            generation.type === "image" ? "png" : "mp4"
                          }`
                        )
                      }
                      className="bg-white/20 hover:bg-white/30 border-white/30"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>

                {/* 信息栏 */}
                <div className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    {generation.type === "image" ? (
                      <ImageIcon className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Video className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="text-xs text-gray-400">
                      {generation.model.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-400">
                      {generation.mode === "text-to-image" || generation.mode === "text-to-video"
                        ? "文生成"
                        : "图生成"}
                    </span>
                  </div>

                  <p className="text-sm text-white line-clamp-2">
                    {generation.prompt}
                  </p>

                  <div className="text-xs text-gray-500">
                    {new Date(generation.timestamp).toLocaleString("zh-CN")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedMedia && (
        <MediaPreview
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </>
  )
}

