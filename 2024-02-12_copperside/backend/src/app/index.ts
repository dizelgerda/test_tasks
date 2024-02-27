import express from "express";
import { PORT } from "../config";
import router from "./routers";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.info(`Server started, PORT = ${PORT}.`);
});
