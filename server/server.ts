import dotenv from "dotenv";
import { app } from "./app";
import { connectToDB } from "./db";

dotenv.config({
  path: ".env",
});

app.listen(process.env.PORT!, () => {
  console.log(`Server is connected with port ${process.env.PORT!} `);
  connectToDB();
});
