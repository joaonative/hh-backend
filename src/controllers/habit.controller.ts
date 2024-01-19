import { Request, Response } from "express";
import HabitModel, { HabitDocument } from "../models/habit.model";

class HabitController {
  async createHabit(req: Request, res: Response) {
    try {
      const { name, description, frequency, author } = req.body;

      const existingHabit = await HabitModel.findOne({ name, author });

      if (existingHabit) {
        return res
          .status(400)
          .send("User already has a habit that contains this name");
      }

      const newHabit: HabitDocument = await HabitModel.create({
        name,
        description,
        frequency,
        author,
      });

      res.status(201).json(newHabit);
    } catch (error) {
      console.error("Error while creating a habit", error);
      res.status(500).send("Internal server error");
    }
  }

  async getHabitsByUser(req: Request, res: Response) {
    try {
      const { author } = req.body;
      const userHabits = await HabitModel.find({ author });

      if (!userHabits) {
        return res.status(400).send("User dont have any habits created");
      }

      return res.status(201).json(userHabits);
    } catch (error) {
      console.error("Error while getting user habits", error);
      res.status(500).send("Internal server error");
    }
  }
}

export default new HabitController();
