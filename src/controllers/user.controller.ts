import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import UserModel from "../models/user.model";

dotenv.config();

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { name, email, image } = req.body;

      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        const token = jwt.sign(
          { email: existingUser.email },
          process.env.JWT_SECRET as string
        );
        return res.status(200).json({ token });
      }

      const newUser = await UserModel.create({
        name,
        email,
        image,
      });

      const token = jwt.sign(
        { email: newUser.email },
        process.env.JWT_SECRET as string
      );

      res.status(201).json({ token });
    } catch (error) {
      console.error("Error while creating user", error);
      res.status(500).send("Internal server error");
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const existingUser = await UserModel.findOne({ email });

      if (!existingUser) {
        return res.status(400).send("The requested user does not exist");
      }

      await UserModel.findOneAndDelete({ email });

      res.status(201).send();
    } catch (error) {
      console.error("Error while deleting user", error);
      res.status(500).send("Internal server error");
    }
  }
}

export default new UserController();
