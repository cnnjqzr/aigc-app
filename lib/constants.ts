// 应用常量配置

export const IMAGE_MODELS = {
  SEEDREAM: 'seedream',
  NANO_BANANA: 'nano-banana',
} as const

export const VIDEO_MODELS = {
  VEO3: 'veo3',
  SORA2: 'sora2',
} as const

export const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 (正方形)' },
  { value: '16:9', label: '16:9 (横向)' },
  { value: '9:16', label: '9:16 (竖向)' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
] as const

export const GENERATION_STEPS = {
  MIN: 10,
  MAX: 50,
  DEFAULT: 30,
} as const

export const VIDEO_DURATION = {
  MIN: 3,
  MAX: 10,
  DEFAULT: 5,
} as const

export const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 50 * 1024 * 1024, // 50MB
} as const

export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const

export const GENERATION_MODES = {
  TEXT_TO_IMAGE: 'text-to-image',
  IMAGE_TO_IMAGE: 'image-to-image',
  TEXT_TO_VIDEO: 'text-to-video',
  IMAGE_TO_VIDEO: 'image-to-video',
} as const

