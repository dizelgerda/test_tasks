import express from "express";
import config from "./config";
import router from "./routes";
import mongoose from "mongoose";
import errorHandler from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";
import { autoPublisher } from "./utils/autoPublisher";
import fileUpload from "express-fileupload";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(fileUpload());

app.use(cors(config.corsOptions));

const publicationInterval = autoPublisher();

app.use(router);
app.use(errorHandler);

mongoose.connect(config.BD_URL);
app.listen(config.PORT, () => {
  console.info(`App started, PORT = ${config.PORT}`);
});

process.on("uncaughtException", () => {
  clearInterval(publicationInterval);
});
