# KIE.ai API 配置说明

## ✅ 已完成的修复

代码已更新以匹配真实的 KIE.ai API 格式。

## 📝 必需的环境变量配置

请确保你的 `.env.local` 文件包含以下配置：

```env
# KIE.ai API Key
KIE_API_KEY=your_actual_api_key_here

# KIE.ai API URL (注意是 /api/v1/jobs/createTask)
NANO_BANANA_API_URL=https://api.kie.ai/api/v1/jobs/createTask

# Webhook 回调地址（必须是公网可访问的地址）
WEBHOOK_BASE_URL=https://your-ngrok-url.ngrok.io
```

## 🔑 关键修改点

### 1. API 端点
- ✅ 已修改为：`https://api.kie.ai/api/v1/jobs/createTask`
- ❌ 不再使用：`https://api.kie.ai/nano-banana`

### 2. 请求格式
现在请求体格式为：
```json
{
  "model": "google/nano-banana",
  "callBackUrl": "https://your-domain.com/api/webhook/nano-banana",
  "input": {
    "prompt": "your prompt here",
    "output_format": "png",
    "image_size": "1:1"
  }
}
```

**关键字段**：
- `model`: 固定为 `"google/nano-banana"`
- `callBackUrl`: 回调URL（注意是驼峰命名）
- `input`: 包含所有生成参数的对象

### 3. 图生图模式
当使用图生图时，`image_urls` 放在 `input` 对象内：
```json
{
  "model": "google/nano-banana",
  "callBackUrl": "https://your-domain.com/api/webhook/nano-banana",
  "input": {
    "prompt": "your prompt here",
    "output_format": "png",
    "image_size": "1:1",
    "image_urls": ["https://your-image-url.com/image.png"]
  }
}
```

### 4. API 响应格式
KIE.ai API 返回的任务ID字段可能是：
- `job_id`
- `jobId`
- `id`

代码已支持所有这些格式。

### 5. Webhook 回调格式
回调数据可能包含：
- 任务ID: `job_id` / `jobId` / `id` / `task_id`
- 状态: `status` (completed/failed/processing/pending/running)
- 输出: `output` / `result`
- 图片URL: `output.image_url` / `output.imageUrl` / `output.url` 等

代码已支持多种格式自动识别。

## 🚀 使用步骤

### 1. 配置环境变量
编辑 `.env.local` 文件，填入正确的配置。

### 2. 本地开发配置 ngrok
```bash
# 启动 ngrok
ngrok http 3000

# 复制 ngrok 提供的 URL，例如：
# https://abc123.ngrok.io

# 更新 .env.local
WEBHOOK_BASE_URL=https://abc123.ngrok.io
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 验证 webhook 端点
访问：
```
https://abc123.ngrok.io/api/webhook/nano-banana
```

应该返回：
```json
{
  "status": "ok",
  "message": "Nano Banana webhook endpoint is ready",
  "timestamp": "..."
}
```

### 5. 测试图片生成
1. 打开 http://localhost:3000
2. 选择 "Nano Banana" 模型
3. 输入提示词
4. 点击"生成图片"
5. 等待回调完成

## 🔍 调试

### 查看请求日志
打开浏览器开发者工具，查看 Console 输出：
```
创建任务: task_xxx
调用 Nano Banana API: https://api.kie.ai/api/v1/jobs/createTask
请求参数: {
  "model": "google/nano-banana",
  "callBackUrl": "...",
  "input": {...}
}
API 响应: {...}
任务创建成功 - 本地ID: task_xxx, 远程ID: job_xxx
```

### 查看回调日志
当 KIE.ai 完成生成后，会回调你的服务器，控制台会显示：
```
收到 KIE.ai webhook 回调: {...}
找到匹配任务 - 本地ID: task_xxx, 远程ID: job_xxx
下载图片: https://...
图片已保存到: /uploads/images/generated_xxx.png
```

### 常见问题

#### 问题1: API 调用失败 401
**原因**: API Key 不正确  
**解决**: 检查 `.env.local` 中的 `KIE_API_KEY`

#### 问题2: 一直显示"生成中..."
**原因**: Webhook 回调失败  
**解决**: 
1. 检查 `WEBHOOK_BASE_URL` 是否正确
2. 确保 ngrok 正在运行
3. 访问 webhook 端点验证可访问性

#### 问题3: 找不到图片URL
**原因**: KIE.ai 响应格式不匹配  
**解决**: 查看回调日志，确认 `output` 字段的结构

## 📊 API 流程图

```
1. 用户提交 → POST /api/generate/image
                ↓
2. 创建任务 → 调用 KIE.ai API
                ↓
3. 返回 taskId → 前端开始轮询
                ↓
4. KIE.ai 处理 → 完成后回调 webhook
                ↓
5. Webhook 接收 → 下载图片到本地
                ↓
6. 更新任务状态 → 前端获取结果
                ↓
7. 展示图片
```

## 🔐 生产环境注意事项

1. **使用真实域名**: 不要使用 ngrok，使用实际的生产域名
2. **环境变量**: 在 Vercel/Netlify 等平台配置环境变量
3. **Webhook 安全**: 考虑添加签名验证（未来改进）
4. **数据库**: 将 task-store 改为数据库存储
5. **云存储**: 考虑使用 S3/R2 存储图片

## 📚 相关文档

- [KIE.ai API 文档](https://kie.ai/nano-banana)
- [NANO_BANANA_INTEGRATION.md](./NANO_BANANA_INTEGRATION.md) - 完整集成文档
- [NANO_BANANA_QUICKSTART.md](./NANO_BANANA_QUICKSTART.md) - 快速启动指南

---

**更新日期**: 2025-10-23  
**版本**: 2.0 (匹配真实 KIE.ai API)

