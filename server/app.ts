import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { logError } from "./middleware/log-error";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({ origin: process.env.ORIGIN! }));

app.use(logError);

export { app };
