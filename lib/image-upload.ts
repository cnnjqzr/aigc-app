// 图片上传辅助函数
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { env } from "./env"

/**
 * 保存上传的图片到本地
 * @param file - 上传的文件
 * @returns 图片的公网访问URL
 */
export async function saveUploadedImage(file: File): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "images")
  
  // 确保目录存在
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  // 生成唯一文件名
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(7)
  const ext = path.extname(file.name) || '.png'
  const filename = `upload_${timestamp}_${randomStr}${ext}`
  const filepath = path.join(uploadDir, filename)

  // 保存文件
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(filepath, buffer)

  // 返回相对URL
  const relativeUrl = `/uploads/images/${filename}`
  
  // 如果有 webhook base URL，返回完整URL供外部访问
  if (env.webhookBaseUrl) {
    return `${env.webhookBaseUrl}${relativeUrl}`
  }
  
  return relativeUrl
}

/**
 * 批量保存上传的图片
 * @param files - 上传的文件数组
 * @returns 图片的公网访问URL数组
 */
export async function saveUploadedImages(files: File[]): Promise<string[]> {
  const urls: string[] = []
  
  for (const file of files) {
    const url = await saveUploadedImage(file)
    urls.push(url)
  }
  
  return urls
}

/**
 * 验证图片文件
 * @param file - 要验证的文件
 * @returns 是否有效
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // 检查文件大小（10MB）
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "图片大小不能超过10MB"
    }
  }

  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "只支持 JPEG, PNG, WEBP 格式"
    }
  }

  return { valid: true }
}

