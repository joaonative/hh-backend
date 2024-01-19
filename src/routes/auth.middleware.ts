import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

interface DecodedUser {
  email: string;
}

interface UserRequest extends Request {
  user?: DecodedUser;
}

const verifyToken = (req: UserRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedUser;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default verifyToken;
