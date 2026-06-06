import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

export const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Rotas
import "./routes/api/mateoService";
import "./routes/api/local";
import "./routes/api/stations";
import "./routes/api/pws";
import "./routes/api/imageEvaluation";

// Inicialização do servidor
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`[server]: Servidor está rodando em http://localhost:${port}`);
  });
}

export default app;