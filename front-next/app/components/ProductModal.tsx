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
 

export default function ProductModal({
  product,
  additionals,
  onClose,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [additionalsQty, setAdditionalsQty] = useState<Record<string, number>>({});
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
  setAdditionalsQty(prev => ({
    ...prev,
    [id]: (prev[id] || 0) + 1,
  }));
};

const removeAdditional = (id: string) => {
  setAdditionalsQty(prev => {
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
  const qty = additionalsQty[a.id] || 0;
  return sum + Number(a.price) * qty;
}, 0);

 
  const total = basePrice * qty + additionalsTotal;
  

  return (
  <div className="fixed inset-0 z-[9999] bg-black/50 flex items-end sm:items-center justify-center">
    <div className="bg-white text-black w-full sm:max-w-md
                  max-h-[85vh] overflow-y-auto
                  rounded-t-2xl sm:rounded-2xl p-4">
      <h2 className="text-xl font-bold text-black">
        {product.name}
      </h2>

      {product.description && (
        <p className="text-sm text-gray-700">
          {product.description}
        </p>
      )}

      {/* Quantidade */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-black font-medium">
          Quantidade
        </span>

        <div className="flex gap-3 items-center">
          <button
            className="w-8 h-8 rounded-full border text-black"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
          >
            −
          </button>

          <span className="font-bold text-black">
            {quantity}
          </span>

          <button
            className="w-8 h-8 rounded-full border text-black"
            onClick={() => setQuantity(q => q + 1)}
          >
            +
          </button>
        </div>
      </div>

      {/* Adicionais */}
       {hasAdditionals && (
        <div className="mt-4">
          <p className="font-semibold mb-2 text-black">
            Adicionais
          </p>

          {additionals.map((a) => {
            const qty = additionalsQty[a.id] || 0;

            return (
              <div
                key={a.id}
                className="flex justify-between items-center text-sm text-black"
              >
                <span>
                  {a.name}
                  <span className="text-gray-600">
                    {" "}
                    (+R$ {Number(a.price).toFixed(2).replace(".", ",")})
                  </span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeAdditional(a.id)}
                    className="w-7 h-7 border rounded-full"
                  >
                    −
                  </button>

                  <span className="w-4 text-center font-semibold">
                    {qty}
                  </span>

                  <button
                    onClick={() => addAdditional(a.id)}
                    className="w-7 h-7 border rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}


      {/* Observação (somente lanches) */}
      {/* {hasAdditionals && (
        <textarea
          className="mt-4 w-full border p-2 text-sm text-black placeholder-gray-500"
          placeholder="Observação (ex: sem cebola)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      )} */}

      {/* Total */}
      <div className="mt-4 font-bold text-black">
        Total: R$ {total.toFixed(2).replace(".", ",")}
      </div>

      {/* Ações */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => {
            reset();
            onClose();
          }}
          className="flex-1 border py-2 text-black"
        >
          Cancelar
        </button>

        <button
          className="flex-1 bg-green-600 text-white py-2 font-semibold"
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

            onClose(); reset();
          }}
        >
          Adicionar
        </button>

      </div>
    </div>
  </div>
);

}