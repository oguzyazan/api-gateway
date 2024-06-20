import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import 'dotenv/config'
import userRoute from "./routes/userRoute";
import { connectDB } from "./config/dbConn";
import mongoose from "mongoose";
import { setAuthHeaders } from "./middlewares/auth";

const services = [
  {
    route: "/category",
    target: "http://localhost:3000/category",
  },
];

const app = express();

var unless = function (middleware) {
  const routes = services.map((s) => s.route);
  return function (req, res, next) {
    var isRotueExist = routes.findIndex((r) => r.startsWith(req.path)) != -1;
    if (isRotueExist) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};

app.use(unless(express.json()));

app.use(setAuthHeaders);

app.use("/user", userRoute);
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.disable("x-powered-by");

services.forEach(({ route, target }) => {
  const proxyOptions = {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${route}`]: "",
    },
  };

  app.use(route, createProxyMiddleware(proxyOptions));
});

connectDB();

const PORT = process.env.PORT || 3500;
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
