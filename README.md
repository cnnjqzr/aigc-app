# AI创作平台 (AIGC App)

一个现代化的AI创作网页应用，支持AI生图和AI生视频功能。

> 🚀 **新手？** 从这里开始 → [START_HERE.md](./START_HERE.md)  
> 📚 **查找文档？** 查看 → [文档索引](./DOCS_INDEX.md)  
> ✅ **检查进度？** 查看 → [完成清单](./CHECKLIST.md)

## 功能特性

### ✨ AI生图
- **文生图**: 通过文字描述生成图片
- **图生图**: 基于参考图片进行AI创作
- **模型支持**: 
  - Seedream
  - Nano Banana
- **自定义参数**:
  - 多种图片尺寸比例 (1:1, 16:9, 9:16, 4:3, 3:4)
  - 可调节生成步数 (10-50步)

### 🎬 AI生视频
- **文生视频**: 通过文字描述生成视频
- **图生视频**: 基于参考图片生成视频动画
- **模型支持**:
  - Veo 3
  - Sora 2
- **高级功能**:
  - 首帧参考图设置
  - 尾帧参考图设置
  - 可调节视频时长 (3-10秒)

### 🎨 界面特性
- 现代化渐变背景设计
- 毛玻璃效果的卡片组件
- 左侧控制面板 + 右侧生成列表的布局
- 响应式设计，支持多种屏幕尺寸
- 实时预览功能
- 一键下载生成内容

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件库**: shadcn/ui
- **图标**: Lucide React
- **UI组件**: Radix UI

## 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 或 pnpm

### 安装依赖

\`\`\`bash
npm install
# 或
yarn install
# 或
pnpm install
\`\`\`

### 开发模式

\`\`\`bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
\`\`\`

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

\`\`\`bash
npm run build
npm start
\`\`\`

## 项目结构

\`\`\`
aigc-app/
├── app/                      # Next.js App Router
│   ├── api/                  # API路由
│   │   ├── generate/         # 生成API
│   │   │   ├── image/        # 图片生成
│   │   │   └── video/        # 视频生成
│   │   └── save/             # 保存API
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 主页面
├── components/               # React组件
│   ├── ui/                   # shadcn/ui组件
│   ├── image-generator.tsx   # 图片生成器
│   ├── video-generator.tsx   # 视频生成器
│   ├── generation-list.tsx   # 生成历史列表
│   └── media-preview.tsx     # 媒体预览组件
├── lib/                      # 工具函数
│   ├── utils.ts              # 通用工具
│   └── api-client.ts         # API客户端
└── public/                   # 静态资源
    ├── uploads/              # 上传文件
    └── saved/                # 保存的生成记录
\`\`\`

## API集成说明

当前版本使用示例数据进行演示。要集成真实的AI模型，请按以下步骤操作：

### 1. 创建环境变量文件

创建 \`.env.local\` 文件：

\`\`\`env
# Seedream API
SEEDREAM_API_URL=your_seedream_api_url
SEEDREAM_API_KEY=your_seedream_api_key

# Nano Banana API
NANO_BANANA_API_URL=your_nano_banana_api_url
NANO_BANANA_API_KEY=your_nano_banana_api_key

# Veo 3 API
VEO3_API_URL=your_veo3_api_url
VEO3_API_KEY=your_veo3_api_key

# Sora 2 API
SORA2_API_URL=your_sora2_api_url
SORA2_API_KEY=your_sora2_api_key
\`\`\`

### 2. 修改API路由

编辑以下文件以集成真实API：
- \`app/api/generate/image/route.ts\` - 图片生成API
- \`app/api/generate/video/route.ts\` - 视频生成API

将示例代码替换为实际的API调用。

### 3. 数据持久化

当前版本将生成记录保存在内存中。对于生产环境，建议：
- 集成数据库 (如 PostgreSQL, MongoDB)
- 使用云存储服务 (如 AWS S3, Cloudflare R2)
- 实现用户认证系统

## 自定义配置

### 修改主题颜色

编辑 \`app/globals.css\` 中的CSS变量来自定义颜色主题。

### 添加新的AI模型

1. 在对应的生成器组件中添加模型选项
2. 在API路由中添加模型处理逻辑
3. 根据需要添加模型特定的参数

## 部署

### Vercel部署（推荐）

1. 将代码推送到GitHub
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 配置环境变量
4. 部署

### Docker部署

\`\`\`bash
# 构建镜像
docker build -t aigc-app .

# 运行容器
docker run -p 3000:3000 aigc-app
\`\`\`

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 支持

如有问题，请提交 Issue 或联系开发团队。

