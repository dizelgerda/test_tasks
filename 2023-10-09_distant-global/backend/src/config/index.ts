import corsOptions from "./corsOptions";

const {
  PORT = 3000,
  SECRET_KEY = "dev_secret",
  BD_URL = "mongodb://localhost:27017/tt2",
} = process.env;

export default {
  PORT,
  SECRET_KEY,
  BD_URL,

  corsOptions,
};
