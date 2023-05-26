import { Router } from "express";
import { createSeedController } from "../seed.controller";

export const seedRouter = Router();

seedRouter.get("", createSeedController);
