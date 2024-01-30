import express from "express";
import verifyToken from "./auth.middleware";

import UserController from "../controllers/user.controller";
import HabitController from "../controllers/habit.controller";
import userController from "../controllers/user.controller";
import habitController from "../controllers/habit.controller";

const router = express.Router();

router.post("/users", UserController.createUser); //create user

router.get("/users/:email", verifyToken, userController.getMonthlyStats); //get stats

router.post("/habits", verifyToken, HabitController.createHabit); //create habit

router.get("/habits", verifyToken, HabitController.getHabitsByUser); //get user habits

router.delete("/habits/:id", verifyToken, habitController.deleteHabit); //delete user habit

router.put("/habits/:id", verifyToken, HabitController.markHabitDoneToday); //mark habit done

export default router;
