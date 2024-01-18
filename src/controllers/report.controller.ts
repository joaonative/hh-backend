import { Request, Response } from "express";
import ReportModel from "../models/report.model";

class ReportController {
  async createReport(req: Request, res: Response) {
    try {
      const { author, report } = req.body;

      const existingReport = await ReportModel.findOne({ author, report });

      if (existingReport) {
        return res.status(400).send("Reports can not be duplicated");
      }

      const newReport = await ReportModel.create({
        author,
        report,
      });
      res.status(201).json(newReport);
    } catch (error) {
      console.error("Error while creating a report", error);
      res.status(500).send("Internal server error");
    }
  }
  async getReportByUser(req: Request, res: Response) {
    try {
      const { author } = req.body;

      const userReports = await ReportModel.find(author);

      if (!userReports) {
        return res.status(400).send("User doesn't have any reporteds created");
      }

      return res.status(201).json(userReports);
    } catch (error) {
      console.error("Error while getting user reports", error);
      res.status(500).send("Internal server error");
    }
  }
}

export default new ReportController();
