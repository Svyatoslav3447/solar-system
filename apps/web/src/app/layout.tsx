import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import Providers from "@/components/Providers";
import { getCssThemeVariables } from "@solar-system/ui";

export const metadata: Metadata = {
  title: "Solar System",
  description: "Test task Solar System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" data-theme="dark" style={getCssThemeVariables("dark") as CSSProperties}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
