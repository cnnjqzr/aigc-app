# API 集成指南

本文档详细说明如何将真实的AI模型API集成到应用中。

## 概述

当前应用支持以下AI模型：

- **图片生成**: Seedream, Nano Banana
- **视频生成**: Veo 3, Sora 2

## 环境配置

### 1. 创建环境变量文件

复制 `.env.example` 为 `.env.local`:

```bash
cp .env.example .env.local
```

### 2. 填写API密钥

编辑 `.env.local`:

```env
# Seedream
SEEDREAM_API_URL=https://api.seedream.ai/v1
SEEDREAM_API_KEY=sk-xxx

# Nano Banana
NANO_BANANA_API_URL=https://api.nanobanana.ai/v1
NANO_BANANA_API_KEY=nb-xxx

# Veo 3
VEO3_API_URL=https://api.veo3.ai/v1
VEO3_API_KEY=veo-xxx

# Sora 2
SORA2_API_URL=https://api.sora2.ai/v1
SORA2_API_KEY=sora-xxx
```

## 图片生成 API 集成

### 文件位置

`app/api/generate/image/route.ts`

### Seedream 集成示例

```typescript
if (model === "seedream") {
  const response = await fetch(`${env.seedreamApiUrl}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.seedreamApiKey}`,
    },
    body: JSON.stringify({
      prompt: prompt,
      aspectRatio: aspectRatio,
      steps: steps,
      // 如果是图生图模式，添加参考图片
      ...(mode === "image-to-image" && imageFile ? {
        initImage: await fileToBase64(imageFile),
      } : {}),
    }),
  })

  if (!response.ok) {
    throw new Error("Seedream API 调用失败")
  }

  const data = await response.json()
  generatedImageUrl = data.imageUrl

  // 可选：下载并保存到本地
  const imageBuffer = await downloadImage(data.imageUrl)
  const savedPath = await saveToLocal(imageBuffer, "images")
  generatedImageUrl = savedPath
}
```

### Nano Banana 集成示例

```typescript
if (model === "nano-banana") {
  const formData = new FormData()
  formData.append("prompt", prompt)
  formData.append("aspect_ratio", aspectRatio)
  formData.append("num_steps", steps.toString())
  
  if (imageFile) {
    formData.append("image", imageFile)
  }

  const response = await fetch(`${env.nanoBananaApiUrl}/generate`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.nanoBananaApiKey}`,
    },
    body: formData,
  })

  const data = await response.json()
  generatedImageUrl = data.output.image_url
}
```

## 视频生成 API 集成

### 文件位置

`app/api/generate/video/route.ts`

### Veo 3 集成示例

```typescript
if (model === "veo3") {
  const requestBody: any = {
    prompt: prompt,
    duration: duration,
  }

  // 添加首帧参考
  if (startFrame) {
    requestBody.startFrame = await fileToBase64(startFrame)
  }

  // 添加尾帧参考
  if (endFrame) {
    requestBody.endFrame = await fileToBase64(endFrame)
  }

  const response = await fetch(`${env.veo3ApiUrl}/generate-video`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.veo3ApiKey}`,
    },
    body: JSON.stringify(requestBody),
  })

  const data = await response.json()
  
  // Veo 3 可能返回任务ID，需要轮询状态
  if (data.taskId) {
    generatedVideoUrl = await pollVideoStatus(data.taskId)
  } else {
    generatedVideoUrl = data.videoUrl
  }
}
```

### Sora 2 集成示例

```typescript
if (model === "sora2") {
  const response = await fetch(`${env.sora2ApiUrl}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": env.sora2ApiKey,
    },
    body: JSON.stringify({
      text_prompt: prompt,
      duration_seconds: duration,
      first_frame: startFrame ? await fileToBase64(startFrame) : undefined,
      last_frame: endFrame ? await fileToBase64(endFrame) : undefined,
    }),
  })

  const data = await response.json()
  generatedVideoUrl = data.video_url
  thumbnailUrl = data.thumbnail_url || startFrameUrl
}
```

## 辅助函数

### 文件转 Base64

```typescript
async function fileToBase64(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  return buffer.toString('base64')
}
```

### 下载远程文件

```typescript
async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
```

### 保存到本地

```typescript
async function saveToLocal(buffer: Buffer, type: "images" | "videos"): Promise<string> {
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${
    type === "images" ? "png" : "mp4"
  }`
  const filepath = path.join(process.cwd(), "public", "uploads", type, filename)
  await writeFile(filepath, buffer)
  return `/uploads/${type}/${filename}`
}
```

### 轮询任务状态

```typescript
async function pollVideoStatus(taskId: string, maxAttempts = 60): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`${env.veo3ApiUrl}/status/${taskId}`, {
      headers: {
        "Authorization": `Bearer ${env.veo3ApiKey}`,
      },
    })

    const data = await response.json()

    if (data.status === "completed") {
      return data.videoUrl
    } else if (data.status === "failed") {
      throw new Error("视频生成失败")
    }

    // 等待5秒后重试
    await new Promise(resolve => setTimeout(resolve, 5000))
  }

  throw new Error("视频生成超时")
}
```

## 错误处理

### 标准错误响应

```typescript
try {
  // API 调用
} catch (error) {
  console.error("生成失败:", error)
  
  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "生成失败",
      code: "GENERATION_FAILED",
    },
    { status: 500 }
  )
}
```

### 常见错误处理

```typescript
// API 密钥无效
if (response.status === 401) {
  return NextResponse.json(
    { error: "API 密钥无效" },
    { status: 401 }
  )
}

// 配额不足
if (response.status === 429) {
  return NextResponse.json(
    { error: "API 调用次数超限，请稍后重试" },
    { status: 429 }
  )
}

// 参数错误
if (response.status === 400) {
  const data = await response.json()
  return NextResponse.json(
    { error: `参数错误: ${data.message}` },
    { status: 400 }
  )
}
```

## 数据持久化

### 使用数据库存储记录

```typescript
import { prisma } from "@/lib/prisma"

// 保存生成记录
const record = await prisma.generation.create({
  data: {
    type: "image",
    model: model,
    prompt: prompt,
    url: generatedImageUrl,
    metadata: {
      aspectRatio,
      steps,
    },
  },
})
```

## 测试

### 测试 API 连接

```bash
# 测试 Seedream
curl -X POST https://api.seedream.ai/v1/generate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"a beautiful sunset","steps":30}'
```

### 单元测试

创建 `__tests__/api/generate.test.ts`:

```typescript
import { POST } from "@/app/api/generate/image/route"

describe("Image Generation API", () => {
  it("should generate image with valid prompt", async () => {
    const formData = new FormData()
    formData.append("prompt", "test prompt")
    formData.append("model", "seedream")
    
    const request = new Request("http://localhost:3000/api/generate/image", {
      method: "POST",
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.data.url).toBeDefined()
  })
})
```

## 生产环境注意事项

1. **安全性**
   - 永远不要在客户端暴露 API 密钥
   - 使用环境变量存储敏感信息
   - 实现请求限流

2. **性能**
   - 使用 CDN 加速媒体文件
   - 实现缓存策略
   - 异步处理长时间任务

3. **监控**
   - 记录 API 调用日志
   - 监控错误率和响应时间
   - 设置告警

4. **成本控制**
   - 实现用户配额系统
   - 监控 API 使用量
   - 优化生成参数

## 常见问题

### Q: 如何处理 API 超时？
A: 设置合理的超时时间，使用重试机制，考虑使用异步任务队列。

### Q: 如何优化大文件上传？
A: 使用分片上传，压缩图片，使用 CDN 直传。

### Q: 如何实现批量生成？
A: 使用队列系统（如 Bull、BullMQ），实现任务调度和进度跟踪。

## 更多资源

- [Next.js API Routes 文档](https://nextjs.org/docs/api-routes/introduction)
- [各AI模型官方文档](#)
- [项目 GitHub Issues](#)

---

如有问题，欢迎创建 Issue 或联系维护团队。

