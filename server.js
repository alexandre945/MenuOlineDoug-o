import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pedidosRouter from "./api/pedidos.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://menu-oline-dougao.vercel.app"
  ],
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use("/api/pedidos", pedidosRouter);
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Servidor rodando na porta ${process.env.PORT || 5000}`)
  );
}

export default app;
// app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
