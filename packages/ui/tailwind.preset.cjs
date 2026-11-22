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
