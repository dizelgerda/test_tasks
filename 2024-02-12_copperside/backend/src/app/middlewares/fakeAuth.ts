import { Request, Response, NextFunction } from "express";
import db from "../../db";
import users from "../../db/schemas/users";
import { eq } from "drizzle-orm";

export default async function (
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const result = await db.select().from(users).where(eq(users.id, 1));
  req.app.set("currentUser", { id: result[0].id });

  next();
}
