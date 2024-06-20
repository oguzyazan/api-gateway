import express from "express";
const router = express.Router();
import userController from "../controllers/userController";
import { auth } from "../middlewares/auth";

router
  //.route("/")
  .get("/", userController.getList)
  .post("/register", userController.register)
  .post("/login", userController.login)
  .post("/logout", auth, userController.logout)
  .put("/", userController.update)
  .delete("/", userController.delete);

export default router;
