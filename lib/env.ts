// 环境变量配置

export const env = {
  // Seedream API
  seedreamApiUrl: process.env.SEEDREAM_API_URL || '',
  seedreamApiKey: process.env.SEEDREAM_API_KEY || '',

  // Nano Banana API (KIE.ai)
  nanoBananaApiUrl: process.env.NANO_BANANA_API_URL || '',
  nanoBananaApiKey: process.env.KIE_API_KEY || '',

  // Veo 3 API
  veo3ApiUrl: process.env.VEO3_API_URL || '',
  veo3ApiKey: process.env.VEO3_API_KEY || '',

  // Sora 2 API
  sora2ApiUrl: process.env.SORA2_API_URL || '',
  sora2ApiKey: process.env.SORA2_API_KEY || '',

  // Webhook settings
  webhookBaseUrl: process.env.WEBHOOK_BASE_URL || '',

  // App settings
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'AI创作平台',
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760'),
}

