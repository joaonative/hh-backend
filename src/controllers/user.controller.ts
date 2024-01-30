import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import UserModel from "../models/user.model";

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
      const userId = req.params.userId;

      // Encontrar o usuário pelo ID
      const user = await UserModel.findById(userId).populate("habits");

      if (!user) {
        return res.status(404).send("User not found");
      }

      if (!user.habits || user.habits.length === 0) {
        return res.status(404).send("User doesn't have any habits");
      }

      // Calcular a soma de monthlyOccurrences para todos os hábitos do usuário
      const totalMonthlyOccurrences = user.habits.reduce(
        (sum, habit) => sum + habit.monthlyOccurrences,
        0
      );

      // Calcular a soma de monthlyOccurrences para hábitos com isGood igual a true
      const totalMonthlyOccurrencesGoodHabits = user.habits.reduce(
        (sum, habit) => (habit.isGood ? sum + habit.monthlyOccurrences : sum),
        0
      );

      // Calcular a soma de monthlyOccurrences para hábitos com isGood igual a false
      const totalMonthlyOccurrencesBadHabits = user.habits.reduce(
        (sum, habit) => (!habit.isGood ? sum + habit.monthlyOccurrences : sum),
        0
      );

      res.status(200).json({
        totalMonthlyOccurrences,
        totalMonthlyOccurrencesGoodHabits,
        totalMonthlyOccurrencesBadHabits,
      });
    } catch (error) {
      console.error("Error while fetching habits summary", error);
      res.status(500).send("Internal server error");
    }
  }
}

export default new UserController();
