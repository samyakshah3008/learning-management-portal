import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { logError } from "./middleware/log-error";
import router from "./routes";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({ origin: process.env.ORIGIN! }));

app.use(logError);

app.use("/api/v1", router);

export { app };
