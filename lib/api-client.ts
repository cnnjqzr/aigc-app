// API客户端工具函数

export async function generateImage(data: {
  prompt: string
  model: string
  mode: string
  aspectRatio: string
  steps: number
  image?: File
}) {
  const formData = new FormData()
  formData.append("prompt", data.prompt)
  formData.append("model", data.model)
  formData.append("mode", data.mode)
  formData.append("aspectRatio", data.aspectRatio)
  formData.append("steps", data.steps.toString())
  
  if (data.image) {
    formData.append("image", data.image)
  }

  const response = await fetch("/api/generate/image", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "生成失败")
  }

  return response.json()
}

export async function generateVideo(data: {
  prompt: string
  model: string
  mode: string
  duration: number
  startFrame?: File
  endFrame?: File
}) {
  const formData = new FormData()
  formData.append("prompt", data.prompt)
  formData.append("model", data.model)
  formData.append("mode", data.mode)
  formData.append("duration", data.duration.toString())
  
  if (data.startFrame) {
    formData.append("startFrame", data.startFrame)
  }
  
  if (data.endFrame) {
    formData.append("endFrame", data.endFrame)
  }

  const response = await fetch("/api/generate/video", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "生成失败")
  }

  return response.json()
}

export async function saveGeneration(data: {
  type: string
  url: string
  metadata: any
}) {
  const response = await fetch("/api/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "保存失败")
  }

  return response.json()
}

