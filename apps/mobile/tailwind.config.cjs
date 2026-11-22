module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', '../../packages/ui/src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  presets: [
    require('nativewind/preset'),
    require('../../packages/ui/tailwind.preset.cjs'),
  ],
};
