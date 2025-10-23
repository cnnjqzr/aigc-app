import { NextRequest, NextResponse } from "next/server"
import taskStore from "@/lib/task-store"

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params

    if (!taskId) {
      return NextResponse.json(
        { error: "任务ID不能为空" },
        { status: 400 }
      )
    }

    // 查找任务
    const task = taskStore.get(taskId)

    if (!task) {
      return NextResponse.json(
        { error: "任务不存在" },
        { status: 404 }
      )
    }

    // 返回任务信息
    return NextResponse.json({
      success: true,
      data: {
        id: task.id,
        status: task.status,
        prompt: task.prompt,
        model: task.model,
        mode: task.mode,
        result: task.result,
        error: task.error,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        // 如果任务完成，返回完整的生成记录格式
        ...(task.status === 'completed' && task.result ? {
          generation: {
            id: task.id,
            type: "image",
            mode: task.mode,
            model: task.model,
            prompt: task.prompt,
            url: task.result,
            timestamp: task.updatedAt,
            aspectRatio: task.aspectRatio,
            steps: task.steps,
          }
        } : {})
      }
    })
  } catch (error) {
    console.error("查询任务状态失败:", error)
    return NextResponse.json(
      { error: "查询任务状态失败" },
      { status: 500 }
    )
  }
}

