import statsModel from "../models/stats.model";
import { Request, Response } from "express";
import UserModel from "../models/user.model";

class StatsController {
  async getYearStats(req: Request, res: Response) {
    try {
      const userEmail = req.params.email;

      if (!userEmail || userEmail === null) {
        return res.status(404).send("User email is required");
      }

      const user = await UserModel.findOne({ email: userEmail });

      if (!user) {
        return res.status(404).send("User not found");
      }

      const allStats = await statsModel.find({ userId: user._id });

      if (!allStats || allStats.length === 0) {
        return res.status(404).send("User doesn't have stats");
      }

      const monthlyOccurrences: Record<number, number> = {};

      allStats.forEach((stat) => {
        const { month, totalOccurrences } = stat;
        monthlyOccurrences[month] = totalOccurrences;
      });

      const monthsArray = Array.from({ length: 12 }, (_, i) => i + 1);

      const resultJSON: Record<number, number> = monthsArray.reduce(
        (acc, month) => {
          acc[month] = monthlyOccurrences[month] || 0;
          return acc;
        },
        {} as Record<number, number>
      );

      res.status(200).json(resultJSON);
    } catch (error) {
      console.error("Error while getting year stats", error);
      return error;
    }
  }
}
export default new StatsController();
