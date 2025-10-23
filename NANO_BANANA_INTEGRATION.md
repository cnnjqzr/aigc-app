# Nano Banana API 集成说明

## 已完成的集成

✅ 已成功集成 Nano Banana API，实现异步回调机制

## 文件结构

### 新增文件

1. **lib/task-store.ts** - 任务状态管理
   - 内存存储任务状态（生产环境建议使用数据库）
   - 支持任务的创建、查询、更新、删除
   - 自动清理超过24小时的旧任务

2. **lib/image-upload.ts** - 图片上传辅助函数
   - 保存用户上传的参考图片
   - 验证图片格式和大小
   - 返回公网可访问的URL（用于图生图模式）

3. **lib/download-image.ts** - 图片下载辅助函数
   - 从 nano-banana 返回的URL下载图片
   - 保存到本地 `public/uploads/images/`
   - 支持批量下载

4. **app/api/webhook/nano-banana/route.ts** - Webhook回调端点
   - 接收 nano-banana 的异步回调
   - 下载生成的图片到本地
   - 更新任务状态
   - 支持 GET 请求用于端点验证

5. **app/api/task/[taskId]/route.ts** - 任务状态查询端点
   - 前端轮询查询任务状态
   - 返回任务详情和生成结果

### 修改文件

1. **lib/env.ts**
   - 添加 `webhookBaseUrl` 配置

2. **app/api/generate/image/route.ts**
   - 接入真实的 nano-banana API
   - 支持文生图和图生图两种模式
   - 创建任务并返回 taskId
   - 配置 webhook 回调

3. **components/image-generator.tsx**
   - 实现任务轮询逻辑
   - 支持 nano-banana 异步生成
   - 保持原有样式不变

## 工作流程

```
1. 用户输入提示词 → 前端发送请求
2. 后端创建任务 → 调用 nano-banana API
3. Nano-banana 异步处理 → 通过 webhook 回调
4. 后端接收回调 → 下载图片到本地
5. 前端轮询查询 → 获取最终结果
6. 展示生成的图片
```

## 环境配置

确保 `.env.local` 包含以下配置：

```env
# Nano Banana API
NANO_BANANA_API_URL=https://api.kie.ai/nano-banana
NANO_BANANA_API_KEY=your_api_key_here

# Webhook 回调地址（必须是公网可访问的地址）
WEBHOOK_BASE_URL=https://your-domain.com
```

**重要提示**：
- `NANO_BANANA_API_URL` - nano-banana API 端点
- `NANO_BANANA_API_KEY` - 您的 API 密钥
- `WEBHOOK_BASE_URL` - 必须是公网可访问的地址，用于接收 webhook 回调

## API 使用

### 文生图 (Text-to-Image)

```typescript
POST /api/generate/image
FormData: {
  prompt: "a beautiful sunset",
  model: "nano-banana",
  mode: "text-to-image",
  aspectRatio: "16:9",
  steps: 30
}

Response: {
  success: true,
  taskId: "task_1234567890_abc123",
  status: "processing",
  message: "图片生成中，请等待..."
}
```

### 图生图 (Image-to-Image)

```typescript
POST /api/generate/image
FormData: {
  prompt: "turn this into a watercolor painting",
  model: "nano-banana",
  mode: "image-to-image",
  aspectRatio: "1:1",
  steps: 30,
  image: File // 参考图片
}

Response: {
  success: true,
  taskId: "task_1234567890_abc123",
  status: "processing"
}
```

### 查询任务状态

```typescript
GET /api/task/[taskId]

Response: {
  success: true,
  data: {
    id: "task_1234567890_abc123",
    status: "completed", // pending | processing | completed | failed
    prompt: "a beautiful sunset",
    result: "/uploads/images/generated_1234567890_abc123.png",
    generation: { /* 完整的生成记录 */ }
  }
}
```

## Webhook 端点

```typescript
POST /api/webhook/nano-banana

Body: {
  task_id: "task_1234567890_abc123",
  status: "completed",
  output: {
    image_url: "https://..."
  }
}
```

## 前端集成

前端自动处理轮询逻辑：

1. 调用 `/api/generate/image` 获取 taskId
2. 每3秒轮询一次 `/api/task/[taskId]`
3. 最多轮询60次（3分钟）
4. 收到 completed 状态后显示结果

用户体验：
- 显示"生成中..."状态
- 自动更新到生成列表
- 失败时显示错误信息

## 支持的图片尺寸

- `1:1` - 正方形
- `9:16` - 竖向
- `16:9` - 横向
- `3:4` - 竖向
- `4:3` - 横向
- `3:2` - 横向
- `2:3` - 竖向
- `5:4` - 横向
- `4:5` - 竖向
- `21:9` - 超宽
- `auto` - 自动

## 错误处理

系统包含完整的错误处理：

1. **API 配置检查** - 验证 API URL 和密钥
2. **文件验证** - 检查图片格式和大小
3. **API 调用失败** - 返回详细错误信息
4. **下载失败** - 记录错误并更新任务状态
5. **超时处理** - 前端轮询最多3分钟

## 测试步骤

### 1. 测试 Webhook 端点

```bash
curl http://localhost:3000/api/webhook/nano-banana
```

应返回：
```json
{
  "status": "ok",
  "message": "Nano Banana webhook endpoint is ready",
  "timestamp": "..."
}
```

### 2. 测试文生图

1. 启动开发服务器：`npm run dev`
2. 打开 http://localhost:3000
3. 选择 "Nano Banana" 模型
4. 输入提示词
5. 点击"生成图片"
6. 等待生成完成（显示"生成中..."）

### 3. 测试图生图

1. 选择 "图生图" 标签
2. 上传参考图片
3. 输入修改提示词
4. 点击"生成图片"
5. 等待生成完成

## 生产环境部署

### 1. 数据库配置

建议将 `lib/task-store.ts` 改为使用真实数据库（如 PostgreSQL, MongoDB）

### 2. Webhook URL

确保 `WEBHOOK_BASE_URL` 是公网可访问的地址：
- 使用 Vercel/Netlify 等平台部署
- 或使用 ngrok 等工具暴露本地端口（开发环境）

### 3. 文件存储

考虑使用云存储服务：
- AWS S3
- Cloudflare R2
- Vercel Blob Storage

### 4. 监控和日志

- 监控 webhook 回调是否正常接收
- 记录 API 调用日志
- 监控任务完成率和失败率

## 故障排查

### 问题：Webhook 未收到回调

**解决方案**：
1. 检查 `WEBHOOK_BASE_URL` 是否正确
2. 确保 webhook 端点公网可访问
3. 检查 nano-banana 控制台的回调日志

### 问题：图片下载失败

**解决方案**：
1. 检查 nano-banana 返回的 URL 是否有效
2. 确保服务器可以访问外网
3. 检查磁盘空间是否充足

### 问题：任务一直处于 processing 状态

**解决方案**：
1. 检查 webhook 回调是否正常
2. 查看服务器日志
3. 手动检查任务状态：访问 `/api/task/[taskId]`

## 参考资源

- [Nano Banana API 文档](https://kie.ai/nano-banana)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [项目代码仓库](#)

## 后续优化建议

1. **数据库集成** - 使用 Prisma + PostgreSQL 存储任务
2. **队列系统** - 使用 Bull/BullMQ 管理任务队列
3. **缓存优化** - 使用 Redis 缓存任务状态
4. **WebSocket** - 实时推送生成进度（替代轮询）
5. **批量生成** - 支持一次生成多张图片
6. **用户认证** - 添加用户系统和配额管理

---

**集成完成时间**: 2025-10-23
**文档版本**: 1.0

