# 贡献指南

感谢你对 AI创作平台 项目的关注！我们欢迎所有形式的贡献。

## 如何贡献

### 报告 Bug

如果你发现了 bug，请：

1. 检查是否已有相关的 Issue
2. 如果没有，创建新的 Issue，包含：
   - 清晰的标题和描述
   - 复现步骤
   - 预期行为和实际行为
   - 截图（如果适用）
   - 环境信息（浏览器、操作系统等）

### 功能建议

我们欢迎新功能建议：

1. 创建 Issue 描述你的想法
2. 说明为什么需要这个功能
3. 如果可能，提供实现思路

### 代码贡献

#### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/yourusername/aigc-app.git
cd aigc-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 保持代码简洁和可读
- 添加必要的注释
- 使用有意义的变量和函数名

#### 提交规范

我们使用语义化的提交信息：

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建或辅助工具的变动

示例：
```
feat: 添加图片批量生成功能
fix: 修复视频预览加载问题
docs: 更新 README 安装说明
```

#### Pull Request 流程

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### Pull Request 要求

- 清晰描述改动内容和原因
- 更新相关文档
- 确保代码通过所有检查
- 保持提交历史清晰

## 开发指南

### 项目结构

```
app/          # Next.js 页面和API
components/   # React 组件
lib/          # 工具函数和配置
hooks/        # 自定义 Hooks
```

### 添加新组件

1. 在 `components/` 目录创建组件文件
2. 使用 TypeScript 定义 Props 类型
3. 添加必要的文档注释
4. 确保组件可复用

### 添加新 API

1. 在 `app/api/` 目录创建路由
2. 实现请求验证
3. 添加错误处理
4. 返回标准化的响应格式

## 行为准则

- 尊重他人
- 友好交流
- 建设性反馈
- 包容不同观点

## 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

## 问题？

如有任何问题，欢迎：
- 创建 Issue
- 加入讨论
- 联系维护者

感谢你的贡献！🎉

