# Nano Banana 快速启动指南

## 前置要求

1. ✅ `.env.local` 已配置（用户已完成）
2. ✅ Node.js 18+ 已安装
3. ✅ Nano Banana API 密钥已获取

## 快速验证集成

### 步骤1: 启动开发服务器

```bash
npm run dev
```

### 步骤2: 验证 Webhook 端点

打开浏览器访问：
```
http://localhost:3000/api/webhook/nano-banana
```

应该看到：
```json
{
  "status": "ok",
  "message": "Nano Banana webhook endpoint is ready",
  "timestamp": "2025-10-23T..."
}
```

### 步骤3: 测试文生图

1. 访问 http://localhost:3000
2. 在左侧面板：
   - 选择 **"Nano Banana"** 模型
   - 保持 **"文生图"** 标签选中
   - 输入提示词，例如：`"a beautiful sunset over mountains"`
   - 点击 **"生成图片"**
3. 观察：
   - 按钮显示"生成中..."
   - 控制台显示轮询日志
   - 右侧列表等待结果

### 步骤4: 观察日志

打开浏览器开发者工具（F12），查看 Console：

**期望看到的日志**：
```
创建任务: task_1234567890_abc123
调用 Nano Banana API: https://api.kie.ai/nano-banana
任务状态 (1/60): processing
任务状态 (2/60): processing
...
任务状态 (N/60): completed
```

### 步骤5: 查看结果

- 生成完成后，图片会出现在右侧列表
- 图片保存在 `public/uploads/images/`
- 可以点击下载按钮保存图片

## 本地开发的 Webhook 配置

由于 nano-banana 需要回调到公网地址，本地开发需要使用隧道工具：

### 使用 ngrok

1. 安装 ngrok：
```bash
npm install -g ngrok
```

2. 启动 ngrok：
```bash
ngrok http 3000
```

3. 复制 ngrok 提供的公网URL，例如：
```
https://abc123.ngrok.io
```

4. 更新 `.env.local`：
```env
WEBHOOK_BASE_URL=https://abc123.ngrok.io
```

5. 重启开发服务器

### 使用 Cloudflare Tunnel

```bash
cloudflared tunnel --url http://localhost:3000
```

## 常见问题

### Q: 任务一直显示"生成中..."

**A**: 检查以下几点：
1. `WEBHOOK_BASE_URL` 是否配置正确
2. Webhook 端点是否公网可访问
3. 查看服务器终端日志，是否收到回调
4. 检查 nano-banana 控制台的回调状态

### Q: API 调用失败

**A**: 检查：
1. `NANO_BANANA_API_KEY` 是否正确
2. `NANO_BANANA_API_URL` 是否正确
3. API 配额是否充足
4. 网络连接是否正常

### Q: 图片下载失败

**A**: 检查：
1. `public/uploads/images/` 目录是否有写入权限
2. 服务器是否可以访问 nano-banana 返回的图片URL
3. 磁盘空间是否充足

## 调试技巧

### 1. 查看任务状态

直接访问任务状态API：
```
http://localhost:3000/api/task/task_1234567890_abc123
```

### 2. 查看所有任务（开发用）

在 `app/api/task/route.ts` 添加（仅开发环境）：
```typescript
import taskStore from "@/lib/task-store"
export async function GET() {
  return NextResponse.json({
    tasks: taskStore.getAll()
  })
}
```

### 3. 模拟 Webhook 回调

使用 curl 或 Postman 发送测试回调：
```bash
curl -X POST http://localhost:3000/api/webhook/nano-banana \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": "task_1234567890_abc123",
    "status": "completed",
    "output": {
      "image_url": "https://picsum.photos/512/512"
    }
  }'
```

## 生产环境部署

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量：
   - `NANO_BANANA_API_URL`
   - `NANO_BANANA_API_KEY`
   - `WEBHOOK_BASE_URL=https://your-app.vercel.app`
4. 部署

### 验证部署

访问：
```
https://your-app.vercel.app/api/webhook/nano-banana
```

应该看到 webhook 端点正常响应。

## 下一步

- [ ] 测试图生图功能
- [ ] 配置云存储（可选）
- [ ] 集成数据库（推荐）
- [ ] 添加用户认证（可选）
- [ ] 监控和日志系统（推荐）

## 支持

如有问题，请：
1. 查看 `NANO_BANANA_INTEGRATION.md` 详细文档
2. 检查服务器终端日志
3. 查看浏览器控制台日志
4. 提交 Issue 到项目仓库

---

祝您使用愉快！🎉

