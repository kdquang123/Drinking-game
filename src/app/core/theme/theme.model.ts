export const THEMES = ['dark', 'light26', 'light27'] as const;

export type ThemeKey = (typeof THEMES)[number];

export const DEFAULT_THEME: ThemeKey = 'light27';

export interface ThemeMeta {
  label: string;
  description: string;
  /** Giá trị token `bg`, dùng cho <meta name="theme-color">. */
  background: string;
}

export const THEME_META: Record<ThemeKey, ThemeMeta> = {
  dark: {
    label: 'Dark Party',
    description: 'Tím đêm + neon, hợp tiệc tối, đỡ chói mắt',
    background: '#241548',
  },
  light26: {
    label: 'Light 2026',
    description: 'Cloud Dancer + Transformative Teal, màu trend 2026',
    background: '#F0EEE9',
  },
  light27: {
    label: 'Light 2027',
    description: 'Luminous Blue, màu trend dự đoán 2027',
    background: '#EEF3FF',
  },
};

export function isThemeKey(value: unknown): value is ThemeKey {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}
