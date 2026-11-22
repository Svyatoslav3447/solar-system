import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/components/app-theme';

export function useTheme() {
  const { themeName } = useAppTheme();
  return Colors[themeName];
}
