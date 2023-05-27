import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { authRouter } from "./auth";
import { seedRouter } from "./seed/routes/seed.route";
import { projectRouter } from "./projects/routes/projects.routes";

dotenv.config();
const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);

const port = parseInt(process.env.PORT as string, 10) || 3001;
const databaseUrl = process.env.MONGO_DB_URL;

app.use("/auth", authRouter);
app.use("/projects", projectRouter);
app.use("/seed", seedRouter);

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
