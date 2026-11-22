import { Platform } from 'react-native';

import { Spacing, Typography } from '@solar-system/ui';

export { Colors, Typography } from '@solar-system/ui';
export type { ThemeColor, ThemeName } from '@solar-system/ui';

export const Fonts = Platform.select({
  ios: {
    sans: Typography.fontFamily.sans[0],
    serif: Typography.fontFamily.serif[0],
    rounded: 'ui-rounded',
    mono: Typography.fontFamily.mono[0],
  },
  default: {
    sans: 'normal',
    serif: Typography.fontFamily.serif[1],
    rounded: 'normal',
    mono: Typography.fontFamily.mono[1],
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export { Spacing };

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
