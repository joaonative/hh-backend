import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import { mongooseConnection } from "./mongoose";

import router from "./routes/routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api", router);

const port = 8080;

mongooseConnection();

app.get("/", (req, res) => {
  res.send("Bem-vindo ao meu projeto Node.js com TypeScript e Express!");
});

app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
