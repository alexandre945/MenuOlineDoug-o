import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pedidosRouter from "./api/pedidos.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS configurado
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://menu-oline-dougao.vercel.app"
  ],
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// ✅ JSON e rotas
app.use(express.json());
app.use("/api/pedidos", pedidosRouter);

// ✅ Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// ✅ Rota padrão
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Inicia servidor (necessário para rodar na Vercel também)
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

export default app;
