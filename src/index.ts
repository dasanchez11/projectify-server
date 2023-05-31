import http from "http";
import mongoose from "mongoose";
import { server } from "./app";

const port = parseInt(process.env.PORT as string, 10) || 3001;
const databaseUrl = process.env.MONGO_DB_URL;

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
