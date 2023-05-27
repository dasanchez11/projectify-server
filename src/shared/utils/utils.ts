import { Response } from "express";

export const handleErrorResponse = (error: any, response: Response) => {
  if (error.status) {
    return response.status(error.status).json({ message: error.message });
  } else {
    return response.status(400).json({ message: error.message });
  }
};
