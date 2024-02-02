import StreakModel from "../models/streak.model";
import { Request, Response } from "express";
import UserModel from "../models/user.model";

class StreakController {
  async updateStreak(author: string, habitCompleted: boolean) {
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const userStreak = await StreakModel.findOne({ author });

      if (userStreak) {
        const lastUpdate = new Date(userStreak.lastUpdate);
        if (
          lastUpdate.getUTCFullYear() === today.getUTCFullYear() &&
          lastUpdate.getUTCMonth() === today.getUTCMonth() &&
          lastUpdate.getUTCDate() === today.getUTCDate()
        ) {
          return;
        }

        if (habitCompleted) {
          userStreak.streakCount += 1;

          const dayOfWeek = today.getUTCDay(); // 0 para Domingo, 1 para Segunda, ..., 6 para Sábado
          userStreak.weeklyDays[dayOfWeek] = true;
        } else {
          userStreak.streakCount = 0;
        }

        userStreak.lastUpdate = today;
        await userStreak.save();
      } else {
        const initialWeeklyDays = Array(7).fill(false);

        const dayOfWeek = today.getUTCDay();
        initialWeeklyDays[dayOfWeek] = true;

        await StreakModel.create({
          author,
          streakCount: habitCompleted ? 1 : 0,
          weeklyDays: initialWeeklyDays,
          lastUpdate: today,
        });
      }
    } catch (error) {
      console.error("Error while marking habit as done today", error);
      return error;
    }
  }

  async getUserStreak(req: Request, res: Response) {
    try {
      const author = req.header("author");
      const userStreak = await StreakModel.findOne({ author });

      if (!author) {
        return res.status(400).send("Author missing");
      }

      if (!userStreak) {
        return res.status(400).send("User dont have any streak");
      }

      return res.status(201).json(userStreak);
    } catch (error) {
      console.error("Error while marking habit as done today", error);
      res.status(500).send("Internal server error");
    }
  }
}

export default new StreakController();
