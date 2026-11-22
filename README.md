# Solar System Explorer

Монорепозиторій інтерактивного застосунку про Сонячну систему. Вебверсія та мобільний застосунок використовують спільні пакети для API, стану, графіки й дизайн-токенів.

## Можливості

- Відображення Сонця, восьми планет і їхніх орбіт.
- Пересування кожної планети вздовж власної орбіти перетягуванням.
- Перегляд координат, знака зодіаку та напрямку руху вибраної планети.
- Оновлення даних із FreeHoroscopeAPI із використанням sidereal zodiac.
- Перемикання світлої та темної тем оформлення.
- Спільний стан планет і теми оформлення у веб- та мобільній версіях.

## Структура монорепозиторію

```text
apps/
  web/       Next.js вебзастосунок
  mobile/    Expo та React Native застосунок
packages/
  api/       API-клієнт, типи й початкові дані планет
  store/     Redux Toolkit store, slices і логіка орбіт
  ui/        Дизайн-токени, графіка планет і спільний Tailwind preset
  config/    Спільні конфігурації TypeScript, ESLint і Prettier
```

Залежності застосунків на спільні пакети підключені через pnpm workspaces.

### Спільні пакети

- `@solar-system/api` — запит планетарних позицій, типи API, початкові дані й форматування координат.
- `@solar-system/store` — Redux store, завантаження та вибір планет, тема оформлення й розрахунок їхніх координат на орбітах.
- `@solar-system/ui` — кольори, типографіка, відступи та SVG-графіка. `tailwind.preset.cjs` підключений у вебверсії та NativeWind у мобільному застосунку.
- `@solar-system/config` — спільні базові налаштування TypeScript, ESLint і Prettier.

## Технології

- **Веб:** Next.js, React, TypeScript, Tailwind CSS 4.
- **Мобільний застосунок:** Expo SDK 58, React Native, Expo Router, NativeWind 4 і Tailwind CSS 3.
- **Спільний стан:** Redux Toolkit і React Redux.
- **Жести:** `@dnd-kit` у вебверсії; React Native Gesture Handler і Reanimated у мобільній.
- **Пакетний менеджер:** pnpm 12.21.0.

## Вимоги

Потрібні Node.js 22.13 або новіша версія та pnpm 12.21.0.

## Встановлення

Команди виконуються з кореневої директорії репозиторію:

```bash
pnpm install
```

## Запуск

### Вебзастосунок

```bash
pnpm dev:web
```

Після запуску вебверсія доступна за адресою `http://localhost:3000`.

### Мобільний застосунок

```bash
pnpm dev:mobile
```

Expo запускає development server і показує QR-код та доступні способи відкрити застосунок на пристрої або емуляторі.

Запуск мобільного застосунку для окремої платформи:

```bash
pnpm --filter mobile android
pnpm --filter mobile ios
pnpm --filter mobile web
```

## Перевірка та збірка

Lint вебверсії:

```bash
pnpm --filter web lint
```

Production-збірка вебверсії:

```bash
pnpm --filter web build
```

Lint мобільного застосунку:

```bash
pnpm --filter mobile lint
```
