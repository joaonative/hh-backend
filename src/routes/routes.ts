import express from "express";

import UserController from "../controllers/UserController";
import HabitController from "../controllers/HabitController";
import HabitLogController from "../controllers/HabitLogController";

const router = express.Router();

router.post("/users", UserController.createUser); //create user

router.post("/habits", HabitController.createHabit); //create habit

router.get(
  "/habit-log/:userId/:habitId/stats",
  HabitLogController.getHabitLogs
); //list habit log

export default router;
