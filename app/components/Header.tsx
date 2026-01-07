"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const API_BASE =
    process.env.NEXT_PUBLIC_ADMIN_API_BASE || "https://dougao-admin.vercel.app";

  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  async function fetchStatus() {
    try {
      const res = await fetch(`${API_BASE}/api/store-status`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setIsOpen(!!data?.isOpen);
    } catch {
      // Se falhar, você pode preferir manter null.
      // Aqui eu assumo fechado pra não passar falso "aberto".
      setIsOpen(false);
    }
  }

  useEffect(() => {
    fetchStatus();
    const t = setInterval(fetchStatus, 30_000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 shadow">
      <div className="px-4 py-4 text-center">
        {/* Título */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-red-700">
          🍔 DOUGÃO LANCHES
        </h1>

        {/* Botões */}
        <div className="mt-3 flex gap-2 overflow-x-auto px-1 justify-start sm:justify-center">
          <button
            onClick={() => scrollTo("lanches")}
            className="shrink-0 bg-yellow-200 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold"
          >
            🍔 Lanches
          </button>

          <button
            onClick={() => scrollTo("combos")}
            className="shrink-0 bg-yellow-200 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold"
          >
            🍟 Combos
          </button>

          <button
            onClick={() => scrollTo("bebidas")}
            className="shrink-0 bg-yellow-200 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold"
          >
            🥤 Bebidas
          </button>

          <button
            onClick={() => scrollTo("bomboniere")}
            className="shrink-0 bg-yellow-200 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold"
          >
            🍫 Bomboniere
          </button>
        </div>

        {/* Horário */}
        <p className="mt-3 text-sm font-medium text-gray-900">
          ⏰ Funcionamos das 19h às 23:30h — Terça a Domingo
        </p>

        {/* Endereço */}
        <p className="text-sm text-gray-900">
          📍 Rua Batista Luzardo, 1005 — São Lourenço, MG
        </p>

        {/* Status dinâmico */}
        <div className="mt-2 flex justify-center">
          {isOpen === null ? (
            <span className="text-sm font-bold text-gray-800 bg-yellow-200/70 border border-yellow-300 px-3 py-1 rounded-full">
              ⏳ Verificando…
            </span>
          ) : isOpen ? (
            <span className="text-sm font-bold text-green-800 bg-green-100 border border-green-200 px-3 py-1 rounded-full">
              🟢 Aberto agora
            </span>
          ) : (
            <span className="text-sm font-bold text-red-700 bg-red-100 border border-red-200 px-3 py-1 rounded-full">
              🔴 Fechado
                <p className="mt-2 text-center text-sm text-gray-600">
          {isOpen === null
            ? ""
            : isOpen
            ? "Estamos abertos! Aproveite para fazer seu pedido 👇"
            : "Estamos fechados no momento. Abrimos de terça a domingo, das 19:00 às 23:30."}
        </p>
            </span>
          )}
        </div>
    

      </div>
    </header>
  );
}
