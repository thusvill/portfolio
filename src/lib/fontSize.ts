export const DEFAULT_FONT_SIZE = 20
export const MIN_FONT_SIZE = 14
export const MAX_FONT_SIZE = 20
export const FONT_SCALE_BASE_SIZE = 16

export function clampFontSize(size: number): number {
  return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, Math.round(size)))
}