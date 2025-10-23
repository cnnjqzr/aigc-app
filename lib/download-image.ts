// 图片下载辅助函数
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

/**
 * 从远程URL下载图片并保存到本地
 * @param url - 远程图片URL
 * @returns 本地图片路径
 */
export async function downloadAndSaveImage(url: string): Promise<string> {
  try {
    // 下载图片
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`下载失败: ${response.status} ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 确保目录存在
    const uploadDir = path.join(process.cwd(), "public", "uploads", "images")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 生成文件名
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    
    // 尝试从URL或Content-Type获取文件扩展名
    let ext = '.png'
    const contentType = response.headers.get('content-type')
    if (contentType) {
      if (contentType.includes('jpeg') || contentType.includes('jpg')) {
        ext = '.jpg'
      } else if (contentType.includes('png')) {
        ext = '.png'
      } else if (contentType.includes('webp')) {
        ext = '.webp'
      }
    }

    const filename = `generated_${timestamp}_${randomStr}${ext}`
    const filepath = path.join(uploadDir, filename)

    // 保存文件
    await writeFile(filepath, buffer)

    // 返回相对路径
    return `/uploads/images/${filename}`
  } catch (error) {
    console.error("下载图片失败:", error)
    throw new Error(`下载图片失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 批量下载图片
 * @param urls - 远程图片URL数组
 * @returns 本地图片路径数组
 */
export async function downloadAndSaveImages(urls: string[]): Promise<string[]> {
  const localPaths: string[] = []
  
  for (const url of urls) {
    try {
      const localPath = await downloadAndSaveImage(url)
      localPaths.push(localPath)
    } catch (error) {
      console.error(`下载图片失败 ${url}:`, error)
      // 继续下载其他图片
    }
  }
  
  return localPaths
}

/**
 * 验证URL是否有效
 * @param url - 要验证的URL
 * @returns 是否有效
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

