import { Request, Response } from "express";
import HabitLogModel from "../models/habit-log.model";

class HabitLogController {
  async getHabitLogs(req: Request, res: Response) {
    try {
      const { userId, habitId } = req.body;

      const habitLogCount = await HabitLogModel.countDocuments({
        user: userId,
        habit: habitId,
        timestamp: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      });

      res.status(200).json({
        habitId,
        userId,
        monthlyOccurrences: habitLogCount,
      });
    } catch (error) {
      console.error("Cannot get habit stats", error);
      res.status(500).send("Internal server error");
    }
  }
}

export default new HabitLogController();
