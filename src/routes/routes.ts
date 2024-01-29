import express from "express";
import verifyToken from "./auth.middleware";

import UserController from "../controllers/user.controller";
import HabitController from "../controllers/habit.controller";
import HabitLogController from "../controllers/habit-log.controller";

const router = express.Router();

router.post("/users", UserController.createUser); //create user

router.post("/habits", verifyToken, HabitController.createHabit); //create habit

router.get("/habits", verifyToken, HabitController.getHabitsByUser); //get user habits

router.put("/habits/:id", verifyToken, HabitController.markHabitDoneToday); //mark habit done

router.get(
  "/habit-log/:userId/:habitId/stats",
  HabitLogController.getHabitLogs
); //list habit log

export default router;
