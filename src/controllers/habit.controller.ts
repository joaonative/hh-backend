import { Request, Response } from "express";
import HabitModel, { HabitDocument } from "../models/habit.model";
import UserModel from "../models/user.model";

class HabitController {
  async createHabit(req: Request, res: Response) {
    try {
      const { name, description, goal, author, isGood } = req.body;

      const existingHabit = await HabitModel.findOne({ name, author });

      if (existingHabit) {
        return res
          .status(400)
          .send("User already has a habit that contains this name");
      }

      const user = await UserModel.findOne({ email: author });

      if (!user) {
        return res.status(400).send("User not found");
      }

      // Criar um novo hábito associado ao usuário
      const newHabit: HabitDocument = await HabitModel.create({
        author: user.email,
        name: name,
        description: description,
        goal: goal,
        isGood: isGood,
      });

      if (user.habits) {
        user.habits.push(newHabit._id);

        await user.save();
      }

      // Salvar as alterações no usuário
      await user.save();

      res.status(201).json(newHabit);
    } catch (error) {
      console.error("Error while creating a habit", error);
      res.status(500).send("Internal server error");
    }
  }

  async markHabitDoneToday(req: Request, res: Response) {
    try {
      const habitId = req.params.id;

      // Encontrar o hábito pelo ID
      const habit = await HabitModel.findById(habitId);

      if (!habit) {
        return res.status(404).send("Habit not found");
      }

      // Verificar se o hábito já foi feito hoje
      if (habit.lastPerformed) {
        const today = new Date();
        const habitDate = new Date(habit.lastPerformed);

        if (
          today.getFullYear() === habitDate.getFullYear() &&
          today.getMonth() === habitDate.getMonth() &&
          today.getDate() === habitDate.getDate()
        ) {
          return res.status(400).send("Habit already done today");
        }
      }

      // Marcar o hábito como feito hoje e incrementar as monthlyOccurrences
      habit.lastPerformed = new Date();
      habit.monthlyOccurrences += 1;
      await habit.save();

      res.status(200).send;
    } catch (error) {
      console.error("Error while marking habit as done today", error);
      res.status(500).send("Internal server error");
    }
  }

  async getHabitsByUser(req: Request, res: Response) {
    try {
      const author = req.header("author");
      const userHabits = await HabitModel.find({ author });

      if (!author) {
        return res.status(400).send("Author missing");
      }

      if (!userHabits || userHabits.length === 0) {
        return res.status(200).json([]);
      }

      return res.status(201).json(userHabits);
    } catch (error) {
      console.error("Error while getting user habits", error);
      res.status(500).send("Internal server error");
    }
  }
}

export default new HabitController();
