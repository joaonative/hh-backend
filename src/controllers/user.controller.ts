import { Request, Response } from "express";
import UserModel from "../models/user.model";

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { name, email, googleId } = req.body;

      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        return res.status(400).send("User with this email already exists");
      }

      const newUser = await UserModel.create({
        name,
        email,
        googleId,
      });

      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error while creating user", error);
      res.status(500).send("Internal server error");
    }
  }
}

export default new UserController();
