import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export default sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createAt: text("create_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
