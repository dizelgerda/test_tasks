import { drizzle } from "drizzle-orm/better-sqlite3";
import { DATABASE_NAME } from "../config";
import Database from "better-sqlite3";

const sqlite = new Database(`${DATABASE_NAME}.db`);
const db = drizzle(sqlite);

export default db;
