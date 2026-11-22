const tokens = require('./src/tokens.json');

module.exports = {
  theme: {
    extend: {
      colors: {
        text: 'var(--text)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        accent: 'var(--accent)',
        orbit: 'var(--orbit)',
        muted: 'var(--text-muted)',
        light: tokens.colors.light,
        dark: tokens.colors.dark,
        'light-background': tokens.colors.light.background,
        'dark-background': tokens.colors.dark.background,
        'light-surface': tokens.colors.light.backgroundElement,
        'dark-surface': tokens.colors.dark.backgroundElement,
        'light-text': tokens.colors.light.text,
        'dark-text': tokens.colors.dark.text,
      },
      spacing: Object.fromEntries(
        Object.entries(tokens.spacing).map(([key, value]) => [key, `${value}px`]),
      ),
      fontFamily: tokens.typography.fontFamily,
      fontSize: Object.fromEntries(
        Object.entries(tokens.typography.fontSize).map(([key, value]) => [
          key,
          [`${value}px`, { lineHeight: `${tokens.typography.lineHeight[key]}px` }],
        ]),
      ),
    },
  },
};
