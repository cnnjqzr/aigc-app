import { NextRequest, NextResponse } from "next/server"
import taskStore from "@/lib/task-store"
import { downloadAndSaveImage } from "@/lib/download-image"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("收到 KIE.ai webhook 回调:", JSON.stringify(body, null, 2))

    // 提取回调数据 (支持多种字段名)
    const { task_id, job_id, jobId, id, status, output, result, error } = body
    
    // 获取远程任务ID
    const remoteJobId = task_id || job_id || jobId || id

    if (!remoteJobId) {
      console.error("回调数据缺少任务ID:", body)
      return NextResponse.json(
        { error: "缺少任务ID" },
        { status: 400 }
      )
    }

    // 根据远程任务ID查找本地任务
    // 遍历所有任务找到匹配的 remoteUrl
    const allTasks = taskStore.getAll()
    const task = allTasks.find(t => t.remoteUrl === remoteJobId) || taskStore.get(remoteJobId)
    
    if (!task) {
      console.error(`任务不存在 - 远程ID: ${remoteJobId}`)
      // 返回成功避免回调重试，但记录警告
      return NextResponse.json({ 
        success: true,
        message: '任务不存在，可能已被删除'
      })
    }

    console.log(`找到匹配任务 - 本地ID: ${task.id}, 远程ID: ${remoteJobId}`)

    // 处理不同的状态
    if (status === "completed" || status === "success" || status === "succeeded") {
      try {
        // 获取图片URL - 支持多种响应格式
        let imageUrl: string | undefined
        
        // 优先从 output 字段获取
        const outputData = output || result
        
        // 尝试不同的可能字段名
        if (outputData?.image_url) {
          imageUrl = outputData.image_url
        } else if (outputData?.imageUrl) {
          imageUrl = outputData.imageUrl
        } else if (outputData?.url) {
          imageUrl = outputData.url
        } else if (outputData?.image_urls && outputData.image_urls.length > 0) {
          imageUrl = outputData.image_urls[0]
        } else if (outputData?.imageUrls && outputData.imageUrls.length > 0) {
          imageUrl = outputData.imageUrls[0]
        } else if (outputData?.urls && outputData.urls.length > 0) {
          imageUrl = outputData.urls[0]
        } else if (typeof outputData === 'string') {
          imageUrl = outputData
        } else if (body.image_url) {
          imageUrl = body.image_url
        } else if (body.url) {
          imageUrl = body.url
        }

        if (!imageUrl) {
          console.error("回调数据中没有找到图片URL:", outputData)
          taskStore.update(task.id, {
            status: 'failed',
            error: '未找到生成的图片URL'
          })
          return NextResponse.json({ success: false, error: '未找到图片URL' })
        }

        console.log(`下载图片: ${imageUrl}`)
        
        // 下载图片到本地
        const localPath = await downloadAndSaveImage(imageUrl)
        console.log(`图片已保存到: ${localPath}`)

        // 更新任务状态为完成
        taskStore.update(task.id, {
          status: 'completed',
          result: localPath,
          remoteUrl: imageUrl
        })

        return NextResponse.json({ 
          success: true,
          message: '图片已保存',
          localPath 
        })
      } catch (downloadError) {
        console.error("下载图片失败:", downloadError)
        
        // 更新任务状态为失败
        taskStore.update(task.id, {
          status: 'failed',
          error: `下载图片失败: ${downloadError instanceof Error ? downloadError.message : '未知错误'}`
        })

        return NextResponse.json({
          success: false,
          error: '下载图片失败'
        }, { status: 500 })
      }
    } else if (status === "failed" || status === "error") {
      // 处理失败状态
      const errorMessage = error || body.message || body.error_message || '生成失败'
      
      taskStore.update(task.id, {
        status: 'failed',
        error: errorMessage
      })

      return NextResponse.json({ 
        success: true,
        message: '已更新任务状态为失败' 
      })
    } else if (status === "processing" || status === "pending" || status === "running") {
      // 更新为处理中状态
      taskStore.update(task.id, {
        status: 'processing'
      })

      return NextResponse.json({ 
        success: true,
        message: '任务处理中' 
      })
    } else {
      console.warn(`未知状态: ${status}`)
      return NextResponse.json({ 
        success: true,
        message: '已收到回调' 
      })
    }
  } catch (error) {
    console.error("处理 webhook 回调失败:", error)
    return NextResponse.json(
      { 
        error: "处理回调失败",
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

// 支持 GET 请求（用于验证 webhook 端点）
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: "ok",
    message: "Nano Banana webhook endpoint is ready",
    timestamp: new Date().toISOString()
  })
}

