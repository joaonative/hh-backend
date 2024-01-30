import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import UserModel from "../models/user.model";
import MonthlyStatsModel from "../models/stats.model";
import statsModel from "../models/stats.model";

dotenv.config();

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).send(`Faltando data ${name} ${email}`);
      }

      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        const token = jwt.sign(
          { email: existingUser.email },
          process.env.JWT_SECRET as string
        );
        return res.status(200).json({ token });
      }

      const newUser = await UserModel.create({
        name,
        email,
      });

      const token = jwt.sign(
        { email: newUser.email },
        process.env.JWT_SECRET as string
      );

      res.status(201).json({ token });
    } catch (error) {
      console.error("Error while creating user", error);
      res.status(500).send("Internal server error");
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const existingUser = await UserModel.findOne({ email });

      if (!existingUser) {
        return res.status(400).send("The requested user does not exist");
      }

      await UserModel.findOneAndDelete({ email });

      res.status(201).send();
    } catch (error) {
      console.error("Error while deleting user", error);
      res.status(500).send("Internal server error");
    }
  }

  async getMonthlyStats(req: Request, res: Response) {
    try {
      const userEmail = req.params.email;
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const user = await UserModel.findOne({ email: userEmail }).populate(
        "habits"
      );

      if (!user) {
        return res.status(404).send("User not found");
      }

      if (!user.habits || user.habits.length === 0) {
        return res.status(404).send("User doesn't have any habits");
      }

      // Verificar se já existe estatística para o mês atual
      let existingStats = await statsModel.findOne({
        userId: user._id,
        month: currentMonth,
        year: currentYear,
      });

      if (existingStats) {
        // Atualizar as estatísticas existentes no banco de dados
        existingStats.totalOccurrences = user.habits.reduce(
          (sum, habit) => sum + habit.monthlyOccurrences,
          0
        );
        existingStats.totalGoodOccurrences = user.habits.reduce(
          (sum, habit) => (habit.isGood ? sum + habit.monthlyOccurrences : sum),
          0
        );
        existingStats.totalBadOccurrences = user.habits.reduce(
          (sum, habit) =>
            !habit.isGood ? sum + habit.monthlyOccurrences : sum,
          0
        );

        existingStats = await existingStats.save();
      } else {
        // Calcular as estatísticas do mês atual
        const totalMonthlyOccurrences = user.habits.reduce(
          (sum, habit) => sum + habit.monthlyOccurrences,
          0
        );
        const totalGoodOccurrences = user.habits.reduce(
          (sum, habit) => (habit.isGood ? sum + habit.monthlyOccurrences : sum),
          0
        );
        const totalBadOccurrences = user.habits.reduce(
          (sum, habit) =>
            !habit.isGood ? sum + habit.monthlyOccurrences : sum,
          0
        );

        // Armazenar as estatísticas mensais no banco de dados
        existingStats = await statsModel.create({
          userId: user._id,
          month: currentMonth,
          year: currentYear,
          totalOccurrences: totalMonthlyOccurrences,
          totalGoodOccurrences,
          totalBadOccurrences,
        });
      }

      // Obter as estatísticas do mês anterior
      const lastMonthStats = await statsModel.findOne({
        userId: user._id,
        month: currentMonth - 1 === 0 ? 12 : currentMonth - 1,
        year: currentMonth - 1 === 0 ? currentYear - 1 : currentYear,
      });

      if (lastMonthStats) {
        // Calcular a diferença percentual em relação ao mês anterior
        const percentChangeGood =
          ((existingStats.totalGoodOccurrences -
            lastMonthStats.totalGoodOccurrences) /
            lastMonthStats.totalGoodOccurrences) *
          100;
        const percentChangeBad =
          ((existingStats.totalBadOccurrences -
            lastMonthStats.totalBadOccurrences) /
            lastMonthStats.totalBadOccurrences) *
          100;
        const percentChangeTotal =
          ((existingStats.totalOccurrences - lastMonthStats.totalOccurrences) /
            lastMonthStats.totalOccurrences) *
          100;

        return res.status(200).json({
          totalMonthlyOccurrences: existingStats.totalOccurrences,
          totalGoodOccurrences: existingStats.totalGoodOccurrences,
          totalBadOccurrences: existingStats.totalBadOccurrences,
          lastMonthStats,
          percentChangeGood,
          percentChangeBad,
          percentChangeTotal,
        });
      } else {
        return res.status(200).json({
          totalMonthlyOccurrences: existingStats.totalOccurrences,
          totalGoodOccurrences: existingStats.totalGoodOccurrences,
          totalBadOccurrences: existingStats.totalBadOccurrences,
        });
      }
    } catch (error) {
      console.error("Error while fetching habits summary", error);
      res.status(500).send("Internal server error");
    }
  }
}

export default new UserController();
