import { Request, Response } from "express";
import { AppDataSource } from "..";
import { HabitLog } from "../entities/HabitLog";
import { Between } from "typeorm";

class HabitLogController {
  private habitLogRepository = AppDataSource.getRepository(HabitLog);

  async getHabitLogs(req: Request, res: Response) {
    try {
      const { userId, habitId } = req.body;

      const habitLog = await this.habitLogRepository.count({
        where: {
          user: userId,
          habit: habitId,
          timestamp: Between(
            new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
          ),
        },
      });

      res.status(200).json({
        habitId,
        userId,
        monthlyOccurrences: habitLog,
      });
    } catch (error) {
      console.error("Cannot get habit stats", error);
      res.status(500).send("Internal server error");
    }
  }
}

export default new HabitLogController();
