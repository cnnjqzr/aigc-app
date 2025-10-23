// 任务状态管理
// 在生产环境中，应该使用数据库来存储任务状态

export interface Task {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  prompt: string
  model: string
  mode: string
  aspectRatio?: string
  steps?: number
  result?: string  // 生成的图片本地URL
  remoteUrl?: string  // nano-banana返回的远程URL
  error?: string
  createdAt: Date
  updatedAt: Date
}

// 内存存储（简单实现，生产环境应使用数据库）
class TaskStore {
  private tasks: Map<string, Task> = new Map()

  create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const task: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.tasks.set(task.id, task)
    return task
  }

  get(taskId: string): Task | undefined {
    return this.tasks.get(taskId)
  }

  update(taskId: string, updates: Partial<Task>): Task | null {
    const task = this.tasks.get(taskId)
    if (!task) {
      return null
    }

    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date(),
    }
    this.tasks.set(taskId, updatedTask)
    return updatedTask
  }

  delete(taskId: string): boolean {
    return this.tasks.delete(taskId)
  }

  // 清理超过24小时的旧任务
  cleanup(maxAgeHours: number = 24): number {
    const now = new Date()
    const maxAge = maxAgeHours * 60 * 60 * 1000
    let deletedCount = 0

    for (const [taskId, task] of this.tasks.entries()) {
      const age = now.getTime() - task.createdAt.getTime()
      if (age > maxAge) {
        this.tasks.delete(taskId)
        deletedCount++
      }
    }

    return deletedCount
  }

  // 获取所有任务（用于调试）
  getAll(): Task[] {
    return Array.from(this.tasks.values())
  }
}

// 单例模式
const taskStore = new TaskStore()

export default taskStore

