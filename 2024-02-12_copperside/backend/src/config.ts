import dotenv from "dotenv";

dotenv.config();

const {
  PORT = 3000,
  DATABASE_NAME = "movie_hub",
  API_KEY,
  CACHE_LIFETIME = 3600, // 1h
} = process.env;

if (!API_KEY) {
  console.warn("API key is missing.");
}

export { PORT, DATABASE_NAME, API_KEY, CACHE_LIFETIME };
