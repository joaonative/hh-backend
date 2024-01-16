import { Request, Response } from "express";
import { AppDataSource } from "..";
import { Habit } from "../entities/Habit";

class HabitController {
  private habitRepository = AppDataSource.getRepository(Habit);

  async createHabit(req: Request, res: Response) {
    try {
      const { name, description, frequency, user } = req.body;

      const existingHabit = await this.habitRepository.findOne({
        where: { name, user },
      });

      if (existingHabit) {
        res.status(400).send("User already has a habit that contain this name");
      }

      const newHabit = this.habitRepository.create({
        name,
        description,
        frequency,
        user,
      });
      await this.habitRepository.save(newHabit);

      res.status(201).json(newHabit);
    } catch (error) {
      console.error("Error while creating an habit", error);
      res.status(500).send("Internal server error");
    }
  }
}
