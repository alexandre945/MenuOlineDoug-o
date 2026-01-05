"use client";

import { useEffect, useState } from "react";
import { getStoreStatus } from "../lib/storeStatus";

export default function StoreStatusBanner() {
  const [status, setStatus] = useState(() => getStoreStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(getStoreStatus());
    }, 30_000); // atualiza a cada 30s

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`rounded-lg p-3 text-sm font-bold text-center ${
        status.isOpen ? "bg-green-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      {status.isOpen ? "🟢 ABERTO" : "🔴 FECHADO"} — {status.message}
    </div>
  );
}
