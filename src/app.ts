import express, { Request, Response } from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import * as dotenv from "dotenv";
import { authRouter } from "./auth";
import { seedRouter } from "./seed/routes/seed.route";
import { projectRouter } from "./projects/routes/projects.routes";
import { reportRouter } from "./reports/routes/report.routes";

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

app.use("/auth", authRouter);
app.use("/projects", projectRouter);
app.use("/reports", reportRouter);
app.use("/seed", seedRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Projectify");
});

export default app;
export const server = http.createServer(app);
