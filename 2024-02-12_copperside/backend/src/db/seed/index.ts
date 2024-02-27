import db from "..";
import users from "../schemas/users";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

migrate(db, { migrationsFolder: "./src/db/migrations" });

// TEST USER
db.insert(users)
  .values({
    email: "i@email.com",
    name: "Test user",
    password: "test",
  })
  .run();
