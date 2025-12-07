import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const BIN_URL = process.env.JSONBIN_URL;
const API_KEY = process.env.JSONBIN_KEY;

// POST /api/pedidos
router.post("/", async (req, res) => {
  try {
    const pedido = req.body;

    // Pegar pedidos atuais do JSONBin
   
    const response = await fetch(process.env.JSONBIN_URL, {
      method: "GET",
      headers: {
        "X-Master-Key": process.env.JSONBIN_KEY
      }
      
    });

    const data = await response.json();
    const pedidosAtuais = data.record || [];

    // Adiciona ID e timestamp
    pedido.id = Date.now();
    pedido.created_at = new Date().toISOString();

    // Adiciona o novo pedido
    pedidosAtuais.push(pedido);

    // Salva de volta no JSONBin
    await fetch(process.env.JSONBIN_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": process.env.JSONBIN_KEY
      },
      body: JSON.stringify(pedidosAtuais)
    });

    console.log("Pedido salvo com sucesso:", pedido);

    res.json({ success: true, pedido });
  } catch (error) {
    console.error("Erro ao salvar pedido:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


// NOVA ROTA GET /api/pedidos → listar todos os pedidos
router.get("/", async (req, res) => {
  try {
    const response = await fetch(process.env.JSONBIN_URL, {
      method: "GET",
      headers: { "X-Master-Key": process.env.JSONBIN_KEY }
    });

    const data = await response.json();
    const pedidosAtuais = data.record || [];

    // remove índice 0 e coloca os mais recentes no topo
    const pedidosOrdenados = pedidosAtuais.slice(1).reverse();

    res.json({ success: true, pedidos: pedidosOrdenados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// 🔹 DELETE /api/pedidos/:id → remove um pedido específico
router.delete("/:id", async (req, res) => {
  const pedidoId = req.params.id;
  console.log("🧾 Recebendo DELETE para ID:", pedidoId);

  try {
    // Busca pedidos atuais
    const response = await fetch(`${BIN_URL}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });
    const data = await response.json();
    const pedidosAtuais = Array.isArray(data.record) ? data.record : [];

    if (pedidosAtuais.length === 0) {
      return res.json({ success: false, message: "Nenhum pedido encontrado" });
    }

    // Mantém placeholder e filtra pedidos reais
    const placeholder = pedidosAtuais[0] || { info: "bin zerado" };
    const pedidosFiltrados = pedidosAtuais
      .slice(1)
      .filter(p => Number(p.id) !== Number(pedidoId));

    const novoConteudo = [placeholder, ...pedidosFiltrados];

    // Atualiza o bin
    const putResponse = await fetch(BIN_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },
      body: JSON.stringify(novoConteudo)
    });

    const putResult = await putResponse.json();
    console.log("📤 PUT result:", putResult);

    res.json({ success: true, message: `Pedido ${pedidoId} removido com sucesso!` });
  } catch (error) {
    console.error("❌ Erro ao excluir pedido:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;



