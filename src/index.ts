import express from "express";
import bodyParser from "body-parser";

import { seedData } from "./insertData_test";

import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Habit } from "./entities/Habit";
import { HabitLog } from "./entities/HabitLog";

import router from "./routes/routes";

const app = express();

app.use(bodyParser.json());
app.use("/api", router);

const port = 3000;

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "1234",
  database: "teste",
  entities: [User, Habit, HabitLog],
  synchronize: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

app.get("/", (req, res) => {
  res.send("Bem-vindo ao meu projeto Node.js com TypeScript e Express!");
});

app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});

// try {
//   seedData();
// } catch (err) {
//   console.error(err);
// }
