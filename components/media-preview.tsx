"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"

interface MediaPreviewProps {
  media: {
    id: string
    type: "image" | "video"
    url: string
    prompt: string
    model: string
    timestamp: Date
  }
  onClose: () => void
}

export default function MediaPreview({ media, onClose }: MediaPreviewProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const handleDownload = async () => {
    try {
      const response = await fetch(media.url)
      const blob = await response.blob()
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `${media.type}-${media.id}.${media.type === "image" ? "png" : "mp4"}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("下载失败:", error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative max-w-6xl w-full max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden">
        {/* 头部 */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex-1">
            <h3 className="text-white font-medium mb-1">{media.model.toUpperCase()}</h3>
            <p className="text-sm text-gray-300 line-clamp-1">{media.prompt}</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDownload}
              className="text-white hover:bg-white/20"
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* 媒体内容 */}
        <div className="flex items-center justify-center min-h-[400px] max-h-[90vh]">
          {media.type === "image" ? (
            <img
              src={media.url}
              alt={media.prompt}
              className="max-w-full max-h-[90vh] object-contain"
            />
          ) : (
            <video
              src={media.url}
              controls
              autoPlay
              loop
              className="max-w-full max-h-[90vh] object-contain"
            />
          )}
        </div>

        {/* 底部信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-xs text-gray-400">
            生成时间: {new Date(media.timestamp).toLocaleString("zh-CN")}
          </p>
        </div>
      </div>
    </div>
  )
}

