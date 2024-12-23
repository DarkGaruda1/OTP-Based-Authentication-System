import express from "express";
import dotenv from "dotenv";
import connect from "./Config/ConnectToDB.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./Routes/AuthRoutes.js";
import userRouter from "./Routes/UserRoutes.js";
const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(morgan("tiny"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT} `);
  connect();
});
