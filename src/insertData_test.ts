import { AppDataSource } from ".";
import { User } from "./entities/User";
import { Habit } from "./entities/Habit";
import { HabitLog } from "./entities/HabitLog";

export const seedData = async () => {
  const connection = await AppDataSource.initialize();

  try {
    // Criação de usuários
    const user1 = await connection.manager.save(User, {
      name: "Usuário 1",
      email: "usuario1@example.com",
      googleId: "googleId1",
    });

    // Criação de hábitos
    const habit1 = await connection.manager.save(Habit, {
      name: "Hábito 1",
      description: "Descrição do Hábito 1",
      frequency: 3,
      user: user1,
    });

    const habit2 = await connection.manager.save(Habit, {
      name: "Hábito 2",
      description: "Descrição do Hábito 2",
      frequency: 2,
      user: user1,
    });

    // Criação de registros de hábitos
    const habitLog1 = await connection.manager.save(HabitLog, {
      monthlyOccurrences: 2,
      user: user1,
      habit: habit1,
    });

    const habitLog2 = await connection.manager.save(HabitLog, {
      monthlyOccurrences: 1,
      user: user1,
      habit: habit2,
    });

    console.log("Dados inseridos com sucesso!");
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
  } finally {
    // Fecha a conexão com o banco de dados
    await connection.destroy();
  }
};
