"use client";
import { buildWhatsAppMessage, openWhatsApp } from "@/app/components/whatsapp";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import { ProductCard } from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import { useCart } from "./context/CartContext";
import StoreStatusBanner from "@/app/components/StoreStatusBanner";


import type { CartItem, CartAdditional } from "./context/CartContext";
import type { PaymentMethod, CardType, OrderType } from "@/app/components/whatsapp";

// const [orderType, setOrderType] = useState<OrderType>("RETIRAR");
// const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("DINHEIRO");
// const [cardType, setCardType] = useState<CardType>("DEBITO");


const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_BASE || "http://localhost:3002";

const PRODUCTS_API_URL = `${API_BASE}/api/products`;
const ADDITIONALS_API_URL = `${API_BASE}/api/additionals`;
const ORDER_ADMIN_API_URL = `${API_BASE}/api/order-admin`;

export default function Page() {
  const { items, addItem, removeItem, clearCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [additionals, setAdditionals] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const [customerNote, setCustomerNote] = useState("");

  const [saving, setSaving] = useState(false);

  const [orderType, setOrderType] = useState<"RETIRAR" | "ENTREGA">("RETIRAR");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [reference, setReference] = useState("");

  type PaymentMethod = "DINHEIRO" | "CARTAO" | "PIX";
  type CardType = "CREDITO" | "DEBITO";
  const [paymentMethod, setPaymentMethod] =
  useState<PaymentMethod>("DINHEIRO");

  const [cardType, setCardType] =
  useState<CardType>("DEBITO");

  const [needChange, setNeedChange] = useState(false);
  const [changeFor, setChangeFor] = useState("");

    //  carrinho flutuante
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemsCount = items.reduce((sum, it) => sum + it.quantity, 0);

      // estado do botão de envio
  const [pendingOrderPayload, setPendingOrderPayload] = useState<any>(null);
  const [showAlreadySent, setShowAlreadySent] = useState(false);


  //  stado do carrinho
  const [openCheckout, setOpenCheckout] = useState(false);

  const DELIVERY_FEE = 7.00;
  const subtotal = items.reduce((sum, item) => {
    const itemTotal =
      item.price * item.quantity +
      item.additionals.reduce(
        (s, a) => s + a.price * a.qty,
        0
      );
    return sum + itemTotal;
  }, 0);

  const total =
    orderType === "ENTREGA"
      ? subtotal + DELIVERY_FEE
      : subtotal;


  // 🔹 Fetch produtos
  useEffect(() => {
    fetch(PRODUCTS_API_URL)
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  // 🔹 Fetch adicionais
  useEffect(() => {
    fetch(ADDITIONALS_API_URL)
      .then((res) => res.json())
      .then(setAdditionals)
      .catch(console.error);
  }, []);

  useEffect(() => {
  if (paymentMethod !== "DINHEIRO") {
    setNeedChange(false);
    setChangeFor("");
  }
}, [paymentMethod]);

 


  const lanches = products.filter(
    (p: any) => p.active && p.category?.name === "Lanches"
  );

  const combos = products.filter(
    (p: any) => p.active && p.category?.name === "Combos"
  );

  const bebidas = products.filter(
    (p: any) => p.active && p.category?.name === "Bebidas"
  );

  const bomboniere = products.filter(
    (p: any) => p.active && p.category?.name === "Bomboniere"
  );

  return (
    <>
      <Header />
      <StoreStatusBanner />
      <main className="min-h-screen bg-yellow-50 text-gray-900 pt-64 px-4 pb-40 space-y-8">
        {/* 🍔 Lanches */}
        <section id="lanches">
          <h2 className="text-xl text-center font-extrabold text-red-700 mb-3">
            🍔 Lanches
          </h2>

          <div className="space-y-3">
            {lanches.map((item: any, index: number) => (
              <ProductCard
                key={item.id}
                title={`${index + 1}.`}
                name={item.name}
                description={item.description}
                price={Number(item.price)}
                onAdd={() => setSelectedProduct(item)}
              />
            ))}
          </div>
        </section>

        {/* 🍟 Combos */}
        <section id="combos">
          <h2 className="text-xl text-center font-extrabold text-red-700 mb-3">
            🍟 Combos
          </h2>

          <div className="space-y-3">
            {combos.map((item: any, index: number) => (
              <ProductCard
                key={item.id}
                title={`${index + 1}.`}
                name={item.name}
                description={item.description}
                price={Number(item.price)}
                onAdd={() => setSelectedProduct(item)}
              />
            ))}
          </div>
        </section>

        {/* 🥤 Bebidas */}
        <section id="bebidas">
          <h2 className="text-xl text-center font-extrabold text-red-700 mb-3">
            🥤 Bebidas
          </h2>

          <div className="space-y-3">
            {bebidas.map((item: any, index: number) => (
              <ProductCard
                key={item.id}
                title={`${index + 1}.`}
                name={item.name}
                description={item.description}
                price={Number(item.price)}
                onAdd={() => setSelectedProduct(item)}
              />
            ))}
          </div>
        </section>

        {/* 🍫 Bomboniere */}
        <section id="bomboniere">
          <h2 className="text-xl text-center font-extrabold text-red-700 mb-3">
            🍫 Bomboniere
          </h2>

          <div className="space-y-3">
            {bomboniere.map((item: any, index: number) => (
              <ProductCard
                key={item.id}
                title={`${index + 1}.`}
                name={item.name}
                description={item.description}
                price={Number(item.price)}
                onAdd={() => setSelectedProduct(item)}
              />
            ))}
          </div>
        </section>

           {/* 🛒 CARRINHO */}
        <section className=" bottom-0 left-0 right-0 bg-white border-t p-4 z-50
             max-h-[85vh] overflow-y-auto pt-6">

        {itemsCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-4 right-4 z-[999] bg-black text-white w-14 h-14 rounded-full
                      flex items-center justify-center shadow-lg"
            aria-label="Abrir carrinho"
          >
            <span className="text-xl">🛒</span>

            {/* Badge */}
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold
                            w-6 h-6 rounded-full flex items-center justify-center">
              {itemsCount}
            </span>
          </button>
        )}

          
              {/* drawer do carrinho */}
          {isCartOpen && (
          <div className="fixed inset-0 z-[1000] bg-black/50 flex items-end sm:items-center justify-center">
            <div className="bg-white w-full sm:max-w-md h-[90vh] sm:h-[85vh]
                            rounded-t-2xl sm:rounded-2xl p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">🛒 Seu pedido</h3>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-red-600 font-semibold"
                >
                  Fechar
                </button>
              </div>

          {items.map((item: CartItem, index: number) => (

            <div
              key={index}
              className="mb-3 border-b pb-2 text-sm"
            >
              <div className="flex justify-between">
                <span className="font-semibold">
                  ({item.quantity}) - {item.name}
                </span>

                <button
                  onClick={() => removeItem(index)}
                  className="text-red-600 text-xs"
                >
                  Remover
                </button>
              </div>

              {/* Adicionais */}
              {item.additionals.length > 0 && (
                <ul className="ml-3 text-gray-600">
                      <p className="font-semibold text-gray-700">
                        Adicionais
                      </p>
                  {item.additionals.map((a) => (
                    <li key={a.id}>

                      + ({a.qty})- {a.name}
                    </li>
                  ))}
                </ul>
              )}

              {/* Observação */}
              {item.note && (
                <p className="ml-3 italic text-gray-500">
                  Obs: {item.note}
                </p>
              )}
            </div>
          ))}

             {items.length > 0 && (() => {
            const DELIVERY_FEE = 7;

            const subtotal = items.reduce((sum, item) => {
              const itemTotal =
                item.price * item.quantity +
                item.additionals.reduce((s, a) => s + a.price * a.qty, 0);

              return sum + itemTotal;
            }, 0);

            const total = orderType === "ENTREGA"
              ? subtotal + DELIVERY_FEE
              : subtotal;

            return (
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>

                {orderType === "ENTREGA" && (
                  <div className="flex justify-between">
                    <span>Taxa de entrega</span>
                    <span>R$ {DELIVERY_FEE.toFixed(2).replace(".", ",")}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            );
          })()}
               {/* 🧾 DADOS DO PEDIDO */}
          {items.length > 0 && (
      <div className="mt-3 space-y-3">
               {/* Tipo do pedido */}
            <div>
              <p className="font-semibold text-sm mb-1">Tipo do pedido</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setOrderType("RETIRAR")}
                  className={`flex-1 border py-2 rounded ${
                    orderType === "RETIRAR"         ? "bg-indigo-600 border-indigo-600 text-white shadow"
                                                    : "bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
                  }`}
                >
                  Retirar
                </button>
                <button
                  onClick={() => setOrderType("ENTREGA")}
                  className={`flex-1 border py-2 rounded ${
                    orderType === "ENTREGA"  ? "bg-indigo-600 border-indigo-600 text-white shadow"
                                           : "bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
                  }`}
                >
                  Entrega
                </button>
              </div>
            </div>

               {/* Nome */}
            <div>
              <p className="font-semibold text-sm mb-1">Seu nome</p>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                placeholder="Ex: Alexandre"
              />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Seu Whatsapp</p>
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                placeholder="9 98452123"
              />
            </div>
            <div>
                <p className="font-semibold text-sm mb-1">Observação</p>
                <input
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                  placeholder="Ex: sem cebola, maionese à parte..."
                />
              </div>


                {/* Campos de entrega */}
            {orderType === "ENTREGA" && (
              <div className="space-y-2">
                <div>
                  <p className="font-semibold text-sm mb-1">Endereço</p>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                    placeholder="Rua, número"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="font-semibold text-sm mb-1">Bairro</p>
                    <input
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full border rounded p-2 text-sm"
                      placeholder="Bairro"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-sm mb-1">Referência</p>
                    <input
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="w-full border rounded p-2 text-sm"
                      placeholder="Perto de..."
                    />
                  </div>
                </div>
              </div>
            )}

               {/* Pagamento */}
        <div>
              <p className="font-semibold text-sm mb-1">Pagamento</p>

          <div className="flex gap-2">
            <button
              onClick={() => setPaymentMethod("DINHEIRO")}
              className={`flex-1 border py-2 rounded ${
                paymentMethod === "DINHEIRO"         ? "bg-indigo-600 border-indigo-600 text-white shadow"
                                                    : "bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
              }`}
            >
              Dinheiro
            </button>
            <button
              onClick={() => setPaymentMethod("CARTAO")}
              className={`flex-1 border py-2 rounded ${
                paymentMethod === "CARTAO"         ? "bg-indigo-600 border-indigo-600 text-white shadow"
                                                  : "bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
              }`}
            >
              Cartão
            </button>

                <button
                type="button"
                onClick={() => setPaymentMethod("PIX")}
                className={`flex-1 border py-2 rounded ${
                  paymentMethod === "PIX"
                    ? "bg-indigo-600 border-indigo-600 text-white shadow"
                    : "bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
                }`}
              >
                Pix/Maquininha
              </button>
          </div>

        {/* Dinheiro: troco */}
        {paymentMethod === "DINHEIRO" && (
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={needChange}
                onChange={(e) => setNeedChange(e.target.checked)}
              />
              Precisa de troco?
            </label>

            {needChange && (
              <input
                value={changeFor}
                onChange={(e) => setChangeFor(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                placeholder="Troco para quanto? Ex: 50"
                inputMode="numeric"
              />
            )}
          </div>
        )}

        {/* Cartão: crédito/débito */}
        {paymentMethod === "CARTAO" && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setCardType("DEBITO")}
              className={`flex-1 border py-2 rounded ${
                cardType === "DEBITO"         ? "bg-indigo-600 border-indigo-600 text-white shadow"
                                             : "bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
              }`}
            >
              Débito
            </button>
            <button
              onClick={() => setCardType("CREDITO")}
              className={`flex-1 border py-2 rounded ${
                cardType === "CREDITO"         ? "bg-indigo-600 border-indigo-600 text-white shadow"
                                               : "bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
              }`}
            >
                    Crédito
                  </button>
          </div>
              )}
        </div>
      </div>
          )}


          <button
              type="button"
              disabled={saving}
              onClick={async () => {
                try {
                  setSaving(true);

                  // ===============================
                  // 1️⃣ Monta CUSTOMER (como backend espera)
                  // ===============================
                   const customer = {
                    name: customerName,
                    phone: customerPhone,
                    note: customerNote,
                    type: orderType === "ENTREGA" ? "ENTREGA" : "RETIRADA",
                    address:
                      orderType === "ENTREGA"
                        ? {
                            street: address,       // (aqui você já coloca "Rua, número")
                            bairro: neighborhood,
                            reference: reference || undefined,
                          }
                        : undefined,
                  };


                  // ===============================
                  // 2️⃣ Monta PAYMENT (como backend espera)
                  // ===============================
                  const payment = {
                    forma:
                      paymentMethod === "DINHEIRO"
                        ? "dinheiro"
                        : paymentMethod === "CARTAO"
                        ? "cartao"
                        : "pix",
                    tipoCartao: paymentMethod === "CARTAO" ? cardType || "" : "",
                    trocoPara:
                      paymentMethod === "DINHEIRO" && needChange
                        ? String(changeFor || "")
                        : "",
                    maquininha: "",
                  };

                  // ===============================
                  // 3️⃣ Ajusta ITEMS (qty -> quantity)
                  // ===============================
                  const itemsForApi = items.map((item) => ({
                    ...item,
                    additionals: (item.additionals || []).map((a: any) => ({
                      ...a,
                      quantity: a.qty, // 🔥 backend usa quantity
                    })),
                  }));

                  // ===============================
                  // 4️⃣ Abre WhatsApp (mensagem continua igual)
                  // ===============================
                  const msg = buildWhatsAppMessage({
                    items,
                    customerName,
                    customerPhone,
                    orderType,
                    address,
                    neighborhood,
                    reference,
                    paymentMethod,
                    cardType,
                    needChange,
                    changeFor,
                    deliveryFee: DELIVERY_FEE,
                  });

                  openWhatsApp(msg);

                  // ===============================
                  // 5️⃣ Salva no banco (FORMATO CERTO)
                  // ===============================
                 const res = await fetch(ORDER_ADMIN_API_URL, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    items: itemsForApi,
                    customer,
                    payment,
                    origin: "CLIENT_WHATSAPP", // origem do pedido
                  }),
                });

                  const text = await res.text();
                  alert(`STATUS: ${res.status}\n${text.slice(0, 200)}`);

                   if (!res.ok) return;

                    // ✅ limpa carrinho
                    clearCart();

                    // ✅ limpa campos do checkout
                    setCustomerName("");
                    setCustomerPhone("");
                    setCustomerNote("");

                    setAddress("");
                    setNeighborhood("");
                    setReference("");

                    setOrderType("RETIRAR");

                    setPaymentMethod("DINHEIRO");
                    setCardType("DEBITO");
                    setNeedChange(false);
                    setChangeFor("");

                    // ✅ fecha drawer/carrinho se quiser
                    setIsCartOpen(false);

                    alert("✅ Pedido registrado no sistema!");

                   
                } catch (e: any) {
                  alert(e?.message || "Erro ao enviar pedido");
                } finally {
                  setSaving(false);
                }
              }}
              className="mt-3 w-full bg-green-600 text-white py-3 rounded font-bold disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Enviar pedido"}
          </button>

        </div>
        </div>
        )}



        </section>
       

      </main>

      <ProductModal
        product={selectedProduct}
        additionals={additionals}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
// redeploy
