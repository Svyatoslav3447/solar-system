
"use client";

import { useEffect } from "react";
import { AppStoreProvider, useAppSelector } from "@solar-system/store";
import { getCssThemeVariables } from "@solar-system/ui";

function ThemeSync() {
  const theme = useAppSelector((state) => state.theme.current);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    for (const [name, value] of Object.entries(getCssThemeVariables(theme))) {
      root.style.setProperty(name, value);
    }
  }, [theme]);

  return null;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppStoreProvider>
      <ThemeSync />
      {children}
    </AppStoreProvider>
  );
}
