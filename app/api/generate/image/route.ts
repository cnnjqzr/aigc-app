import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { env } from "@/lib/env"
import taskStore from "@/lib/task-store"
import { saveUploadedImage, validateImageFile } from "@/lib/image-upload"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const prompt = formData.get("prompt") as string
    const model = formData.get("model") as string
    const mode = formData.get("mode") as string
    const aspectRatio = formData.get("aspectRatio") as string
    const steps = parseInt(formData.get("steps") as string) || 30
    const imageFile = formData.get("image") as File | null

    if (!prompt) {
      return NextResponse.json(
        { error: "提示词不能为空" },
        { status: 400 }
      )
    }

    // 确保上传目录存在
    const uploadDir = path.join(process.cwd(), "public", "uploads", "images")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 处理不同的模型
    if (model === "seedream") {
      // Seedream 模型暂时使用示例数据
      const generatedImageUrl = `https://picsum.photos/seed/${Date.now()}/512/512`
      
      const generation = {
        id: Date.now().toString(),
        type: "image",
        mode: mode,
        model: model,
        prompt: prompt,
        url: generatedImageUrl,
        timestamp: new Date().toISOString(),
        aspectRatio: aspectRatio,
        steps: steps,
      }

      return NextResponse.json({
        success: true,
        data: generation,
      })
    } else if (model === "nano-banana") {
      // 调用真实的 Nano Banana API
      return await handleNanoBananaGeneration({
        prompt,
        mode,
        aspectRatio,
        steps,
        imageFile
      })
    }

    return NextResponse.json(
      { error: "不支持的模型" },
      { status: 400 }
    )
  } catch (error) {
    console.error("图片生成失败:", error)
    return NextResponse.json(
      { error: "图片生成失败", details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}

async function handleNanoBananaGeneration({
  prompt,
  mode,
  aspectRatio,
  steps,
  imageFile
}: {
  prompt: string
  mode: string
  aspectRatio: string
  steps: number
  imageFile: File | null
}) {
  try {
    // 检查 API 配置
    if (!env.nanoBananaApiUrl || !env.nanoBananaApiKey) {
      return NextResponse.json(
        { error: "Nano Banana API 未配置" },
        { status: 500 }
      )
    }

    // 创建任务记录
    const task = taskStore.create({
      status: 'pending',
      prompt,
      model: 'nano-banana',
      mode,
      aspectRatio,
      steps
    })

    console.log(`创建任务: ${task.id}`)

    // 准备 API 请求数据
    let apiEndpoint = env.nanoBananaApiUrl  // https://api.kie.ai/api/v1/jobs/createTask

    // 构建 input 对象
    let inputData: any = {
      prompt: prompt,
      output_format: "png",
      image_size: aspectRatio || "1:1"
    }

    // 如果是图生图模式，需要上传参考图片
    if (mode === "image-to-image" && imageFile) {
      // 验证图片
      const validation = validateImageFile(imageFile)
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        )
      }

      // 保存图片并获取公网URL
      const imageUrl = await saveUploadedImage(imageFile)
      inputData.image_urls = [imageUrl]
      
      console.log(`参考图片URL: ${imageUrl}`)
    }

    // 构建完整的请求体 (符合 KIE.ai API 格式)
    let requestBody: any = {
      model: "google/nano-banana",
      input: inputData
    }

    // 添加 callback URL (注意是 callBackUrl 不是 webhook_url)
    if (env.webhookBaseUrl) {
      requestBody.callBackUrl = `${env.webhookBaseUrl}/api/webhook/nano-banana`
    }

    console.log("调用 Nano Banana API:", apiEndpoint)
    console.log("请求参数:", JSON.stringify(requestBody, null, 2))

    // 调用 Nano Banana API
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.nanoBananaApiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API 调用失败: ${response.status} ${response.statusText}`, errorText)
      
      // 更新任务状态为失败
      taskStore.update(task.id, {
        status: 'failed',
        error: `API 调用失败: ${response.status}`
      })

      return NextResponse.json(
        { error: `API 调用失败: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const apiResult = await response.json()
    console.log("API 响应:", apiResult)

    // 保存 KIE.ai 返回的远程任务ID（job_id 或 id）
    const remoteJobId = apiResult.job_id || apiResult.id || apiResult.jobId
    
    // 更新任务状态为处理中，并保存远程任务ID
    taskStore.update(task.id, {
      status: 'processing',
      remoteUrl: remoteJobId  // 保存远程任务ID用于追踪
    })

    console.log(`任务创建成功 - 本地ID: ${task.id}, 远程ID: ${remoteJobId}`)

    // 返回任务ID给前端，前端将轮询查询状态
    return NextResponse.json({
      success: true,
      taskId: task.id,
      remoteJobId: remoteJobId,
      status: 'processing',
      message: '图片生成中，请等待...'
    })
  } catch (error) {
    console.error("Nano Banana API 调用失败:", error)
    return NextResponse.json(
      { error: "API 调用失败", details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}

