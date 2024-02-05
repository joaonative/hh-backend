import express from "express";
import verifyToken from "./auth.middleware";

import UserController from "../controllers/user.controller";
import HabitController from "../controllers/habit.controller";
import userController from "../controllers/user.controller";
import habitController from "../controllers/habit.controller";
import streakController from "../controllers/streak.controller";
import statsController from "../controllers/stats.controller";
import reportController from "../controllers/report.controller";

const router = express.Router();

router.post("/users", UserController.createUser); //create user

router.get("/users/:email", verifyToken, userController.getMonthlyStats); //get stats

router.get("/stats/:email", verifyToken, statsController.getYearStats); //get year stats

router.get("/streak", verifyToken, streakController.getUserStreak); //get streak

router.post("/habits", verifyToken, HabitController.createHabit); //create habit

router.get("/habits", verifyToken, HabitController.getHabitsByUser); //get user habits

router.delete("/habits/:id", verifyToken, habitController.deleteHabit); //delete user habit

router.put("/habits/:id", verifyToken, HabitController.markHabitDoneToday); //mark habit done

router.post("/motivational", verifyToken, reportController.createReport);

router.get("/motivational", verifyToken, reportController.getReports);

export default router;
