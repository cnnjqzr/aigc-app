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
import { ImagePlus, Wand2 } from "lucide-react"

interface ImageGeneratorProps {
  onGenerate: (generation: any) => void
}

export default function ImageGenerator({ onGenerate }: ImageGeneratorProps) {
  const [mode, setMode] = useState<"text-to-image" | "image-to-image">("text-to-image")
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("seedream")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [steps, setSteps] = useState([30])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!prompt) {
      alert("请输入提示词")
      return
    }

    setIsGenerating(true)

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000))

      const generation = {
        id: Date.now().toString(),
        type: "image",
        mode: mode,
        model: model,
        prompt: prompt,
        url: `https://picsum.photos/seed/${Date.now()}/512/512`, // 示例图片
        timestamp: new Date(),
        aspectRatio: aspectRatio,
        steps: steps[0],
      }

      onGenerate(generation)
      
      // 重置表单
      setPrompt("")
      setImageFile(null)
      setImagePreview("")
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
        <CardTitle className="text-white">AI生图</CardTitle>
        <CardDescription className="text-gray-300">
          使用 Seedream 或 Nano Banana 模型生成图片
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text-to-image">文生图</TabsTrigger>
            <TabsTrigger value="image-to-image">图生图</TabsTrigger>
          </TabsList>

          <TabsContent value="text-to-image" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="model" className="text-white">模型选择</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model" className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seedream">Seedream</SelectItem>
                  <SelectItem value="nano-banana">Nano Banana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aspect-ratio" className="text-white">图片尺寸</Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger id="aspect-ratio" className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">1:1 (正方形)</SelectItem>
                  <SelectItem value="16:9">16:9 (横向)</SelectItem>
                  <SelectItem value="9:16">9:16 (竖向)</SelectItem>
                  <SelectItem value="4:3">4:3</SelectItem>
                  <SelectItem value="3:4">3:4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-white">提示词</Label>
              <Textarea
                id="prompt"
                placeholder="描述你想生成的图片..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="steps" className="text-white">生成步数: {steps[0]}</Label>
              <Slider
                id="steps"
                min={10}
                max={50}
                step={1}
                value={steps}
                onValueChange={setSteps}
                className="py-4"
              />
            </div>
          </TabsContent>

          <TabsContent value="image-to-image" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="model" className="text-white">模型选择</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model" className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seedream">Seedream</SelectItem>
                  <SelectItem value="nano-banana">Nano Banana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-upload" className="text-white">上传参考图片</Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="bg-white/5 border-white/20 text-white file:text-white"
                />
                {imagePreview && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt-i2i" className="text-white">提示词</Label>
              <Textarea
                id="prompt-i2i"
                placeholder="描述你想如何修改这张图片..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="steps-i2i" className="text-white">生成步数: {steps[0]}</Label>
              <Slider
                id="steps-i2i"
                min={10}
                max={50}
                step={1}
                value={steps}
                onValueChange={setSteps}
                className="py-4"
              />
            </div>
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isGenerating ? (
            <>
              <Wand2 className="mr-2 h-4 w-4 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <ImagePlus className="mr-2 h-4 w-4" />
              生成图片
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

