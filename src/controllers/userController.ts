import asyncHandler from "express-async-handler";
import userService from "../services/userService";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth";

const getList = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getList();
  res.json(users);
});

const register = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body;
  const createdUser = await userService.register(user);

  if (createdUser.error) {
    res.status(500).json({ message: createdUser.error });
  } else {
    res
      .status(201)
      .json({ message: `New user ${createdUser.user?.Username} created` });
  }
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body;
  const loggedInUser = await userService.login(user);
  res.status(200).json(loggedInUser);
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.query.id.toString();
  const user = await userService.update(userId, req.body);
  res.status(200).json({ message: `User ${user.Username} updated` });
});

const _delete = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.query.id.toString();
  await userService.delete(userId);
  res.status(200).json({ message: `User deleted` });
});

const logout = asyncHandler(async (req: CustomRequest, res: Response) => {
  if (req.userId) {
    await userService.logout(req.userId, req.token);
  }
  res.status(200).json({ message: `User logged out successfully.` });
});

export default {
  getList,
  update,
  delete: _delete,
  register,
  login,
  logout,
};
