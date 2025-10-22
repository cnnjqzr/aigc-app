import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { type, url, metadata } = data

    // 确保保存目录存在
    const saveDir = path.join(process.cwd(), "public", "saved")
    if (!existsSync(saveDir)) {
      await mkdir(saveDir, { recursive: true })
    }

    // 在实际应用中，这里应该：
    // 1. 将生成记录保存到数据库
    // 2. 可选：将媒体文件保存到本地或云存储
    
    // 示例：保存到JSON文件
    const savedPath = path.join(saveDir, `${Date.now()}-metadata.json`)
    await writeFile(savedPath, JSON.stringify({ type, url, metadata, savedAt: new Date() }, null, 2))

    return NextResponse.json({
      success: true,
      message: "保存成功",
    })
  } catch (error) {
    console.error("保存失败:", error)
    return NextResponse.json(
      { error: "保存失败" },
      { status: 500 }
    )
  }
}

