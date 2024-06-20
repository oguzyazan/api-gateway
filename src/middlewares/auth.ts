import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../schemas/user";

export interface CustomRequest extends Request {
  userId?: string;
  token?: string;
}

export interface DecodedToken {
  _id: string;
}

const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Authentication failed. Token missing.");
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY) as DecodedToken;
    const user = await User.findOne({
      _id: decoded._id,
      "Tokens.token": token,
    });

    if (!user) {
      throw new Error("Authentication failed. User not found.");
    }

    req.userId = user._id as string;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Authentication failed." });
  }
};

const setAuthHeaders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    next();
    return;
  }

  const decoded = jwt.verify(token, process.env.JWT_KEY) as DecodedToken;
  const user = await User.findOne({
    _id: decoded._id,
    "Tokens.token": token,
  });

  if (!user) {
    next();
    return;
  }

  req.headers["x-auth-user"] = user._id as string;
  req.headers["x-auth-user-roles"] = JSON.stringify(user.Roles);

  next();
};

export { auth, setAuthHeaders };
