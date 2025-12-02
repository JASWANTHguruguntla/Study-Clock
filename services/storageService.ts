import { ClockView, LOCAL_STORAGE_THEME_KEY, LOCAL_STORAGE_VIEW_KEY, LOCAL_STORAGE_FORMAT_KEY } from '../types';

export const getStoredThemeIndex = (): number => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch (e) {
    return 0;
  }
};

export const setStoredThemeIndex = (index: number): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, index.toString());
  } catch (e) {
    console.error('Failed to save theme index', e);
  }
};

export const getStoredView = (): ClockView => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_VIEW_KEY);
    return stored === ClockView.DIGITAL ? ClockView.DIGITAL : ClockView.ANALOGUE;
  } catch (e) {
    return ClockView.ANALOGUE;
  }
};

export const setStoredView = (view: ClockView): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_VIEW_KEY, view);
  } catch (e) {
    console.error('Failed to save view preference', e);
  }
};

export const getStoredIs24Hour = (): boolean => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_FORMAT_KEY);
    return stored === 'true';
  } catch (e) {
    return false;
  }
};

export const setStoredIs24Hour = (is24Hour: boolean): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_FORMAT_KEY, is24Hour.toString());
  } catch (e) {
    console.error('Failed to save format preference', e);
  }
};