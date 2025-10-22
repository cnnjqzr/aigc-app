"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Video, Wand2 } from "lucide-react"

interface VideoGeneratorProps {
  onGenerate: (generation: any) => void
}

export default function VideoGenerator({ onGenerate }: VideoGeneratorProps) {
  const [mode, setMode] = useState<"text-to-video" | "image-to-video">("text-to-video")
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("veo3")
  const [startFrame, setStartFrame] = useState<File | null>(null)
  const [endFrame, setEndFrame] = useState<File | null>(null)
  const [startFramePreview, setStartFramePreview] = useState<string>("")
  const [endFramePreview, setEndFramePreview] = useState<string>("")
  const [duration, setDuration] = useState([5])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleStartFrameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setStartFrame(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setStartFramePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEndFrameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEndFrame(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setEndFramePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!prompt) {
      alert("请输入提示词")
      return
    }

    if (mode === "image-to-video" && !startFrame) {
      alert("请上传首帧参考图片")
      return
    }

    setIsGenerating(true)

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 3000))

      const generation = {
        id: Date.now().toString(),
        type: "video",
        mode: mode,
        model: model,
        prompt: prompt,
        url: "https://www.w3schools.com/html/mov_bbb.mp4", // 示例视频
        thumbnail: startFramePreview || `https://picsum.photos/seed/${Date.now()}/512/288`,
        timestamp: new Date(),
        duration: duration[0],
      }

      onGenerate(generation)
      
      // 重置表单
      setPrompt("")
      setStartFrame(null)
      setEndFrame(null)
      setStartFramePreview("")
      setEndFramePreview("")
    } catch (error) {
      console.error("生成失败:", error)
      alert("生成失败，请重试")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white">AI生视频</CardTitle>
        <CardDescription className="text-gray-300">
          使用 Veo 3 或 Sora 2 模型生成视频
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text-to-video">文生视频</TabsTrigger>
            <TabsTrigger value="image-to-video">图生视频</TabsTrigger>
          </TabsList>

          <TabsContent value="text-to-video" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="model-video" className="text-white">模型选择</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model-video" className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veo3">Veo 3</SelectItem>
                  <SelectItem value="sora2">Sora 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt-video" className="text-white">提示词</Label>
              <Textarea
                id="prompt-video"
                placeholder="描述你想生成的视频场景..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white">视频时长: {duration[0]}秒</Label>
              <Slider
                id="duration"
                min={3}
                max={10}
                step={1}
                value={duration}
                onValueChange={setDuration}
                className="py-4"
              />
            </div>
          </TabsContent>

          <TabsContent value="image-to-video" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="model-video-i2v" className="text-white">模型选择</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model-video-i2v" className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veo3">Veo 3</SelectItem>
                  <SelectItem value="sora2">Sora 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-frame" className="text-white">首帧参考图</Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="start-frame"
                  type="file"
                  accept="image/*"
                  onChange={handleStartFrameChange}
                  className="bg-white/5 border-white/20 text-white file:text-white"
                />
                {startFramePreview && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <img
                      src={startFramePreview}
                      alt="Start Frame"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-frame" className="text-white">尾帧参考图（可选）</Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="end-frame"
                  type="file"
                  accept="image/*"
                  onChange={handleEndFrameChange}
                  className="bg-white/5 border-white/20 text-white file:text-white"
                />
                {endFramePreview && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <img
                      src={endFramePreview}
                      alt="End Frame"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt-video-i2v" className="text-white">提示词</Label>
              <Textarea
                id="prompt-video-i2v"
                placeholder="描述视频的运动和变化..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration-i2v" className="text-white">视频时长: {duration[0]}秒</Label>
              <Slider
                id="duration-i2v"
                min={3}
                max={10}
                step={1}
                value={duration}
                onValueChange={setDuration}
                className="py-4"
              />
            </div>
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          {isGenerating ? (
            <>
              <Wand2 className="mr-2 h-4 w-4 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              生成视频
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

