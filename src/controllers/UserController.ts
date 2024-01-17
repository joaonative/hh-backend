import { Request, Response } from "express";
import { AppDataSource } from "..";
import { User } from "../entities/User";

class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(req: Request, res: Response) {
    try {
      const { name, email, googleId } = req.body;

      const newUser = this.userRepository.create({
        name,
        email,
        googleId,
      });
      await this.userRepository.save(newUser);

      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error while creating user", error);
      res.status(500).send("Internal server error");
    }
  }
}

export default new UserController();
