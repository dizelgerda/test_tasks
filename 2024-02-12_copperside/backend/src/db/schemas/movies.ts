import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import users from "./users";
import { sql } from "drizzle-orm";

export default sqliteTable(
  "movies",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    mdbID: text("mdb_id").notNull(),
    owner: integer("owner")
      .references(() => users.id)
      .notNull(),
    rating: integer("score"),
    createAt: text("create_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    uniquePair: unique("unique_pair").on(table.mdbID, table.owner),
  }),
);
