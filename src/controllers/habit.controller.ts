import { Request, Response } from "express";
import HabitModel, { HabitDocument } from "../models/habit.model";

class HabitController {
  async createHabit(req: Request, res: Response) {
    try {
      const { name, description, frequency, user } = req.body;

      const existingHabit = await HabitModel.findOne({ name, user });

      if (existingHabit) {
        return res
          .status(400)
          .send("User already has a habit that contains this name");
      }

      const newHabit: HabitDocument = await HabitModel.create({
        name,
        description,
        frequency,
        user,
      });

      res.status(201).json(newHabit);
    } catch (error) {
      console.error("Error while creating a habit", error);
      res.status(500).send("Internal server error");
    }
  }
}

export default new HabitController();
