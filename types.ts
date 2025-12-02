export interface ThemeColors {
  bg: string;
  surface: string;
  accent: string;
  muted: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
}

export enum ClockView {
  ANALOGUE = 'analogue',
  DIGITAL = 'digital',
}

export const LOCAL_STORAGE_THEME_KEY = 'clockThemeIndex';
export const LOCAL_STORAGE_VIEW_KEY = 'clockView';
export const LOCAL_STORAGE_FORMAT_KEY = 'clockIs24Hour';