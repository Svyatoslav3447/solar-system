import { useAppDispatch, useAppSelector, toggleTheme } from '@solar-system/store';
export type { ThemeName } from '@solar-system/ui';

export function useAppTheme() {
  const dispatch = useAppDispatch();
  const themeName = useAppSelector((state) => state.theme.current);
  return { themeName, toggleTheme: () => dispatch(toggleTheme()) };
}
