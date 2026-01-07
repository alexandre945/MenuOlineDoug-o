"use client";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
};

type Additional = {
  id: string;
  name: string;
  price: number;
};

type Props = {
  product: Product | null;
  additionals: Additional[];
  onClose: () => void;
};

export default function ProductModal({ product, additionals, onClose }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [additionalsQty, setAdditionalsQty] = useState<Record<string, number>>(
    {}
  );
  const { addItem } = useCart();

  useEffect(() => {
    if (!product) return;
    setQuantity(1);
    setNote("");
    setAdditionalsQty({});
  }, [product?.id]);

  const reset = () => {
    setQuantity(1);
    setNote("");
    setAdditionalsQty({});
  };

  if (!product) return null;

  const LANCHES_ID = 1;
  const hasAdditionals = Number(product.categoryId) === LANCHES_ID;

  const basePrice = Number(product.price);
  const qty = Number(quantity);

  const addAdditional = (id: string) => {
    setAdditionalsQty((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const removeAdditional = (id: string) => {
    setAdditionalsQty((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const additionalsTotal = additionals.reduce((sum, a) => {
    const q = additionalsQty[a.id] || 0;
    return sum + Number(a.price) * q;
  }, 0);

  const total = basePrice * qty + additionalsTotal;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-end sm:items-center justify-center p-3">
      {/* MODAL com layout em coluna */}
      <div className="bg-white text-black w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-xl">
        
        {/* HEADER fixo */}
        <div className="p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-black">{product.name}</h2>
              {product.description && (
                <p className="text-sm text-gray-700 mt-1">
                  {product.description}
                </p>
              )}
            </div>

            <button
              onClick={() => {
                reset();
                onClose();
              }}
              aria-label="Fechar"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CONTEÚDO com SCROLL (miolo) */}
        <div className="p-4 overflow-y-auto">
          {/* Quantidade */}
          <div className="flex justify-between items-center">
            <span className="text-black font-medium">Quantidade</span>

            <div className="flex gap-3 items-center">
              <button
                className="w-9 h-9 rounded-full border border-gray-300 hover:bg-gray-100 active:scale-95 transition"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>

              <span className="font-bold text-black w-6 text-center">
                {quantity}
              </span>

              <button
                className="w-9 h-9 rounded-full border border-gray-300 hover:bg-gray-100 active:scale-95 transition"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Adicionais */}
          {hasAdditionals && (
            <div className="mt-4">
              <p className="font-semibold mb-2 text-black">Adicionais</p>

              <div className="space-y-2">
                {additionals.map((a) => {
                  const q = additionalsQty[a.id] || 0;

                  return (
                    <div
                      key={a.id}
                      className="flex justify-between items-center text-sm text-black border rounded-xl px-3 py-2"
                    >
                      <div className="pr-3">
                        <p className="font-medium">{a.name}</p>
                        <p className="text-xs text-gray-600">
                          + R$ {Number(a.price).toFixed(2).replace(".", ",")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeAdditional(a.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 active:scale-95 transition"
                        >
                          −
                        </button>

                        <span className="w-5 text-center font-bold">
                          {q}
                        </span>

                        <button
                          onClick={() => addAdditional(a.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 active:scale-95 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Total (pode ficar no footer também, mas aqui já melhora) */}
          <div className="mt-4 font-extrabold text-black">
            Total: R$ {total.toFixed(2).replace(".", ",")}
          </div>
        </div>

        {/* FOOTER fixo (ações) */}
        <div className="p-4 border-t bg-white sticky bottom-0">
          <div className="flex gap-2">
            <button
              onClick={() => {
                reset();
                onClose();
              }}
              className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 active:scale-[0.99] transition"
            >
              Cancelar
            </button>

            <button
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-extrabold hover:bg-green-700 active:scale-[0.99] transition shadow"
              onClick={() => {
                addItem({
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  quantity,
                  additionals: additionals
                    .filter((a) => additionalsQty[a.id])
                    .map((a) => ({
                      id: a.id,
                      name: a.name,
                      price: Number(a.price),
                      qty: additionalsQty[a.id],
                    })),
                  note,
                });

                onClose();
                reset();
              }}
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
