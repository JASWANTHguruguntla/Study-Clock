import { Theme } from './types';

export const THEMES: Theme[] = [
  {
    name: 'Dark',
    colors: {
      bg: '#000000',
      surface: '#1c1c1c', // Lightened from #0a0a0a for card visibility
      accent: '#9bd3ff',
      muted: '#9aa7b0',
    },
  },
  {
    name: 'Light',
    colors: {
      bg: '#f6f7f8',
      surface: '#ffffff',
      accent: '#2b6ea3',
      muted: '#6b7280',
    },
  },
  {
    name: 'Calm Blue',
    colors: {
      bg: '#071124',
      surface: '#0f1f36',
      accent: '#6fb3ff',
      muted: '#98b6d6',
    },
  },
  {
    name: 'Warm Sunset',
    colors: {
      bg: '#1b0b05',
      surface: '#2b1a12',
      accent: '#ffb27a',
      muted: '#d4a38e',
    },
  },
  {
    name: 'Mint Green',
    colors: {
      bg: '#08120d',
      surface: '#0f2620',
      accent: '#7fe7b1',
      muted: '#9bd6c0',
    },
  },
];