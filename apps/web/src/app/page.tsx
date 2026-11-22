
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import SolarSystem from "@/components/SolarSystem";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((current) => current + 1);
  };

  return (
    <main className="min-h-screen bg-[#090D14]">
      <Header onRefresh={handleRefresh} />

      <SolarSystem refreshKey={refreshKey} />
    </main>
  );
}
