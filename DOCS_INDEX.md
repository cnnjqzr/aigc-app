# 📖 文档索引

快速找到你需要的文档。

## 🚀 开始使用

### [START_HERE.md](./START_HERE.md) ⭐ **推荐先看**
3步快速启动项目，5分钟上手使用。

### [QUICKSTART.md](./QUICKSTART.md)
详细的快速启动指南，包含安装、配置和使用说明。

### [README.md](./README.md)
完整的项目说明文档，包含所有功能介绍。

## 🔧 开发文档

### [API_INTEGRATION.md](./API_INTEGRATION.md)
如何集成真实的 AI 模型 API，包含：
- 环境配置
- API 调用示例
- 错误处理
- 测试方法

### [CONTRIBUTING.md](./CONTRIBUTING.md)
如何为项目做贡献：
- 开发环境设置
- 代码规范
- 提交指南
- Pull Request 流程

### [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
项目完整总结：
- 已实现功能列表
- 技术栈详解
- 文件结构说明
- 扩展建议

## 📁 项目结构

```
aigc-app/
│
├── 📄 文档文件
│   ├── START_HERE.md           ⭐ 从这里开始
│   ├── README.md               完整项目说明
│   ├── QUICKSTART.md           快速启动
│   ├── API_INTEGRATION.md      API集成指南
│   ├── CONTRIBUTING.md         贡献指南
│   ├── PROJECT_SUMMARY.md      项目总结
│   └── DOCS_INDEX.md           本文档
│
├── 📁 源代码
│   ├── app/                    Next.js 页面和 API
│   ├── components/             React 组件
│   ├── lib/                    工具函数
│   └── hooks/                  自定义 Hooks
│
└── ⚙️ 配置文件
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    ├── tailwind.config.js
    ├── Dockerfile
    └── .env.example
```

## 🎯 按需求查找

### 我想快速运行项目
→ [START_HERE.md](./START_HERE.md)

### 我想了解所有功能
→ [README.md](./README.md)

### 我想集成真实的 AI 模型
→ [API_INTEGRATION.md](./API_INTEGRATION.md)

### 我想修改代码或贡献
→ [CONTRIBUTING.md](./CONTRIBUTING.md)

### 我想了解技术实现细节
→ [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

### 我想部署到生产环境
→ [README.md](./README.md) 的部署章节

## 💡 常见问题

### 如何启动项目？
查看 [START_HERE.md](./START_HERE.md) 第一部分。

### 为什么生成的是示例图片？
当前版本使用演示数据。要连接真实 API，查看 [API_INTEGRATION.md](./API_INTEGRATION.md)。

### 如何修改界面样式？
编辑 `app/globals.css` 修改主题，或直接修改组件文件。

### 如何添加新的 AI 模型？
1. 在 `lib/constants.ts` 添加模型配置
2. 在对应的生成器组件添加选项
3. 在 API 路由添加处理逻辑

详见 [API_INTEGRATION.md](./API_INTEGRATION.md)。

### 如何部署？
支持多种方式：
- Vercel: 一键部署
- Docker: 使用提供的 Dockerfile
- 其他平台: 参考 [README.md](./README.md)

## 🔗 外部资源

### 技术栈文档
- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

### AI 模型
- Seedream API (根据实际情况添加链接)
- Nano Banana API (根据实际情况添加链接)
- Veo 3 API (根据实际情况添加链接)
- Sora 2 API (根据实际情况添加链接)

## 📞 获取帮助

- 💬 GitHub Discussions
- 🐛 GitHub Issues
- 📧 联系维护者

---

**选择一个文档开始吧！** 👆

