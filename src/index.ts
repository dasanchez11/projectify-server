import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { authRouter } from "./auth";

dotenv.config();
const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const server = http.createServer(app);

const port = parseInt(process.env.PORT as string, 10) || 3001;
const databaseUrl = process.env.MONGO_DB_URL;

app.use("/auth", authRouter);

mongoose
  .connect(databaseUrl)
  .then((res) => {
    server.listen(port, () => {
      console.log("app running on port", port);
    });
  })
  .catch((error) => {
    console.log(error);
  });
