// 验证工具函数

import { FILE_SIZE_LIMITS, SUPPORTED_IMAGE_FORMATS } from './constants'

export function validatePrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, error: '提示词不能为空' }
  }

  if (prompt.length > 1000) {
    return { valid: false, error: '提示词不能超过1000个字符' }
  }

  return { valid: true }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: '请选择一个文件' }
  }

  if (!SUPPORTED_IMAGE_FORMATS.includes(file.type as any)) {
    return { valid: false, error: '不支持的图片格式，请上传 JPG、PNG 或 WEBP 格式' }
  }

  if (file.size > FILE_SIZE_LIMITS.IMAGE) {
    return { valid: false, error: '图片大小不能超过 10MB' }
  }

  return { valid: true }
}

export function validateGenerationParams(params: {
  steps?: number
  duration?: number
}): { valid: boolean; error?: string } {
  if (params.steps !== undefined) {
    if (params.steps < 10 || params.steps > 50) {
      return { valid: false, error: '生成步数必须在 10-50 之间' }
    }
  }

  if (params.duration !== undefined) {
    if (params.duration < 3 || params.duration > 10) {
      return { valid: false, error: '视频时长必须在 3-10 秒之间' }
    }
  }

  return { valid: true }
}

