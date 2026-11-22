import tokens from './tokens.json';

export const Colors = tokens.colors;
export const Spacing = tokens.spacing;
export const Typography = tokens.typography;

export type ThemeName = keyof typeof Colors;
export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

const CSS_VARIABLES: Record<ThemeColor, `--${string}`> = {
  text: '--text',
  background: '--background',
  backgroundElement: '--surface',
  backgroundSelected: '--surface-selected',
  textSecondary: '--text-muted',
  accent: '--accent',
  border: '--border',
  orbit: '--orbit',
  surfaceSoft: '--surface-soft',
  surfaceHover: '--surface-hover',
  success: '--status-success',
  warning: '--status-warning',
  error: '--status-error',
};

export function getCssThemeVariables(theme: ThemeName) {
  return Object.fromEntries(
    Object.entries(CSS_VARIABLES).map(([key, variable]) => [
      variable,
      Colors[theme][key as ThemeColor],
    ]),
  ) as Record<`--${string}`, string>;
}

export { getArtworkDataUri, getArtworkSvg, type ArtworkId } from './artwork';
