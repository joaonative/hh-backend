import { Request, Response } from "express";
import ReportModel from "../models/report.model";

class ReportController {
  async createReport(req: Request, res: Response) {
    try {
      const { author, report, imageUrl, name } = req.body;

      if (!author || !report || !imageUrl) {
        return res.status(400).send("Fields missing");
      }

      const existingReport = await ReportModel.findOne({ author, report });

      if (existingReport) {
        return res.status(400).send("Reports can not be duplicated");
      }

      const newReport = await ReportModel.create({
        author,
        report,
        imageUrl,
        name,
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

      if (!author) {
        return res.status(400).send("Author missing");
      }

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
  async getReports(req: Request, res: Response) {
    try {
      const reports = await ReportModel.find({});

      if (!reports || reports.length === 0) {
        return res.status(404).json({ message: "No reports found" });
      }

      res.status(200).json(reports);
    } catch (error) {
      console.error("Error while getting reports", error);
      res.status(500).send("Internal server error");
    }
  }
}

export default new ReportController();
