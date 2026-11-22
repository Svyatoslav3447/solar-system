
"use client";

import { Sun, Moon, RefreshCw } from "lucide-react";
import { toggleTheme, useAppDispatch, useAppSelector } from "@solar-system/store";
import Image from "next/image";
import { getArtworkDataUri } from "@solar-system/ui";

interface HeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function Header({
  onRefresh,
  isRefreshing = false,
}: HeaderProps) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.current);

  const isDark = theme === "dark";

  return (
    <header
      className="w-full border-b transition-colors duration-300"
      style={{
        background: "var(--background)",
        color: "var(--text)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto flex h-[82px] max-w-[1440px] items-center justify-between px-5 sm:px-10">

        <div className="flex items-center gap-3">
          <Image
            src={getArtworkDataUri("solar-system-logo")}
            width={46}
            height={46}
            alt=""
            aria-hidden="true"
            className="shrink-0"
            unoptimized
          />

          <span className="font-serif text-[25px] font-medium tracking-[-1px]">
            Solar System
          </span>
        </div>

        <div className="flex h-full items-center">

          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            aria-label="Change theme"
            className="flex h-full w-12 items-center justify-center transition-opacity hover:opacity-60"
            style={{ color: "var(--text)" }}
          >
            {isDark ? (
              <Sun size={19} strokeWidth={1.5} />
            ) : (
              <Moon size={19} strokeWidth={1.5} />
            )}
          </button>

          <div
            className="mx-3 h-7 w-px"
            style={{ background: "var(--border)" }}
          />

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="group flex h-full items-center gap-2.5 text-[12px] font-medium uppercase tracking-[1.2px] transition-opacity hover:opacity-60 disabled:opacity-40"
            style={{ color: "var(--text)" }}
          >
            <RefreshCw
              size={15}
              strokeWidth={1.6}
              className={`transition-transform duration-500 ${
                isRefreshing
                  ? "animate-spin"
                  : "group-hover:rotate-90"
              }`}
            />

            <span className="hidden sm:inline">
              Update positions
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
