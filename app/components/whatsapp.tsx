// app/components/whatsapp.ts
import type { CartItem } from "@/app/context/CartContext";
export type PaymentMethod = "DINHEIRO" | "CARTAO" | "PIX";
export type OrderType = "RETIRAR" | "ENTREGA";
export type CardType = "CREDITO" | "DEBITO";

export type BuildWhatsAppInput = {
  items: CartItem[];

  // cliente
  customerName: string;
  customerPhone: string;
  customerNote?: string; 

  // pedido
  orderType: OrderType;

  // entrega (só se orderType === "ENTREGA")
  address?: string;
  neighborhood?: string;
  reference?: string;

  // pagamento
  paymentMethod: PaymentMethod;
  cardType?: CardType; // só se CARTAO
  needChange?: boolean; // só se DINHEIRO
  changeFor?: string; // só se needChange

  // taxa (ex: 7)
  deliveryFee: number;
};

function formatBRL(value: number) {
  return value.toFixed(2).replace(".", ",");
}

function onlyDigits(v: string) {
  return (v || "").replace(/\D/g, "");
}

function moneyToNumberBR(v: string) {
  // "50" | "50,00" | "50.00"
  const normalized = (v || "").replace(/\./g, "").replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

function paymentText(input: BuildWhatsAppInput) {
  if (input.paymentMethod === "PIX") return "Pix (maquininha)";

  if (input.paymentMethod === "CARTAO") {
    const ct = input.cardType || "DEBITO";
    return `Cartão (${ct})`;
  }

  // DINHEIRO
  if (!input.needChange) return "Dinheiro (sem troco)";
  if (input.changeFor?.trim()) return `Dinheiro (troco para R$ ${input.changeFor})`;
  return "Dinheiro (troco)";
}

function validate(input: BuildWhatsAppInput) {
  const errors: string[] = [];

  if (!input.items?.length) errors.push("Carrinho vazio.");
  if (!input.customerName?.trim()) errors.push("Informe o nome do cliente.");
  if (!onlyDigits(input.customerPhone)) errors.push("Informe o WhatsApp/telefone do cliente.");

  if (input.orderType === "ENTREGA") {
    if (!input.address?.trim()) errors.push("Informe o endereço.");
    if (!input.neighborhood?.trim()) errors.push("Informe o bairro.");
    // referência opcional (se quiser obrigar, descomenta):
    // if (!input.reference?.trim()) errors.push("Informe a referência.");
  }

  if (input.paymentMethod === "CARTAO" && !input.cardType) {
    // se você SEMPRE define cardType no state, isso nunca vai estourar
    errors.push("Selecione Crédito ou Débito.");
  }

  if (input.paymentMethod === "DINHEIRO" && input.needChange) {
    const val = moneyToNumberBR(input.changeFor || "");
    if (!val || val <= 0) errors.push("Informe o valor do troco (ex: 50).");
  }

  return errors;
}

export function buildWhatsAppMessage(input: BuildWhatsAppInput) {
  const errors = validate(input);
  if (errors.length) throw new Error(errors.join("\n"));

  const lines: string[] = [];
  let subtotal = 0;

  lines.push("🧾 *NOVO PEDIDO*");
  lines.push("");

  // Cliente
  lines.push("👤 *Cliente:*");
  lines.push(`- Nome: ${input.customerName}`);
  lines.push(`- WhatsApp: ${onlyDigits(input.customerPhone)}`);
  lines.push("");

    // Observação geral (do checkout)
  if (input.customerNote?.trim()) {
    lines.push("📝 *Observação:*");
    lines.push(`- ${input.customerNote.trim()}`);
    lines.push("");
  }

  // Tipo + entrega
  lines.push("🚚 *Tipo:*");
  lines.push(`- ${input.orderType === "ENTREGA" ? "Entrega" : "Retirar no local"}`);

  if (input.orderType === "ENTREGA") {
    lines.push("");
    lines.push("📍 *Endereço:*");
    lines.push(`- ${input.address}`);
    lines.push(`- Bairro: ${input.neighborhood}`);
    if (input.reference?.trim()) lines.push(`- Referência: ${input.reference}`);
  }

  // Pagamento
  lines.push("");
  lines.push("💳 *Pagamento:*");
  lines.push(`- ${paymentText(input)}`);

  // Itens
  lines.push("");
  lines.push("🍔 *Itens:*");

  input.items.forEach((item) => {
    const base = item.price * item.quantity;
    subtotal += base;

    lines.push(`- ${item.quantity}- ${item.name} (R$ ${formatBRL(item.price)})`);
  
    if (item.additionals?.length) {
       lines.push(`   ➕ Adicionais:`);
      item.additionals.forEach((a) => {
        subtotal += a.price * a.qty;
        lines.push(`   + ${a.qty}- ${a.name} (R$ ${formatBRL(a.price)})`);
      });
    }

    if (item.note?.trim()) {
      lines.push(`   📝 Obs: ${item.note}`);
    }
  });

  const fee = input.orderType === "ENTREGA" ? input.deliveryFee : 0;
  const total = subtotal + fee;

  lines.push("");
  lines.push(`🧮 *Subtotal:* R$ ${formatBRL(subtotal)}`);
  if (fee > 0) lines.push(`🚚 *Taxa de entrega:* R$ ${formatBRL(fee)}`);
  lines.push(`💰 *Total:* R$ ${formatBRL(total)}`);

  lines.push("");
  lines.push("✅ Pedido enviado pelo sistema Dougão");

  return lines.join("\n");
}

export function openWhatsApp(message: string) {
  const phone = process.env.NEXT_PUBLIC_CLIENT_NUMBER_WHATSAPP;

  if (!phone) {
    alert("Número do WhatsApp não configurado");
    return;
  }

  const url = `https://wa.me/${onlyDigits(phone)}?text=${encodeURIComponent(message)}`;
   window.open(url, "_blank", "noopener,noreferrer");
}
