import { ImageIcon, Video } from "lucide-react"

interface EmptyStateProps {
  type: "all" | "image" | "video"
}

export default function EmptyState({ type }: EmptyStateProps) {
  const messages = {
    all: {
      icon: ImageIcon,
      title: "暂无生成内容",
      description: "请在左侧选择生成类型并开始创作",
    },
    image: {
      icon: ImageIcon,
      title: "还没有生成图片",
      description: "使用左侧面板生成你的第一张AI图片",
    },
    video: {
      icon: Video,
      title: "还没有生成视频",
      description: "使用左侧面板生成你的第一个AI视频",
    },
  }

  const { icon: Icon, title, description } = messages[type]

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-white/5 rounded-full p-6 mb-4">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-center max-w-md">{description}</p>
    </div>
  )
}

