import express, { Request, Response } from "express";
import { DirectoryService, UserService } from "../services";
import { checkJwt, loadUser } from "../middleware/authz.middleware";
import { param } from "express-validator";
import { requireAdmin, ReturnValidationErrors } from "../middleware";
import { UserStatus } from "../data/models";

export const userRouter = express.Router();

userRouter.use(checkJwt, loadUser);

const db = new UserService();

userRouter.get("/me", async (req: Request, res: Response) => {
  return res.json({ data: req.user });
});

userRouter.get("/", requireAdmin, async (req: Request, res: Response) => {
  let users = await db.getAll();

  for (let user of users) {
    user.display_name = `${user.FIRST_NAME} ${user.LAST_NAME}`;
    user.IS_ADMIN = user.IS_ADMIN == "Y";
  }

  return res.json({ data: users });
});

userRouter.post("/", requireAdmin, async (req: Request, res: Response) => {
  let { user } = req.body;

  if (user) {
    let existing = await db.getByEmail(user.email.toLowerCase());

    if (existing) {
      return res.json({ data: { error: [{ text: "User already exists", variant: "error" }] } });
    }

    await db.create({
      EMAIL: user.email.toLowerCase(),
      USER_ID: "SUB_MISSING",
      STATUS: UserStatus.ACTIVE,
      FIRST_NAME: user.first_name,
      LAST_NAME: user.last_name,
      IS_ADMIN: "N",
      ROLE: "",
      CREATE_DATE: new Date(),
    });
  }
  return res.json({});
});

userRouter.put(
  "/:email",
  requireAdmin,
  [param("email").notEmpty().isString()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { email } = req.params;
    let { STATUS, IS_ADMIN, ROLE } = req.body;

    let existing = await db.getByEmail(email);

    if (existing) {
      existing.STATUS = STATUS;
      existing.IS_ADMIN = IS_ADMIN ? "Y" : "N";
      existing.ROLE = IS_ADMIN ? null : ROLE;

      if (STATUS == "Inactive") {
        existing.IS_ADMIN = "N";
        existing.ROLE = "";
      }

      await db.update(email, existing);

      return res.json({
        messages: [{ variant: "success", text: "User saved" }],
      });
    }

    res.status(404).send();
  }
);

userRouter.delete(
  "/:email",
  requireAdmin,
  [param("email").notEmpty().isString()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { email } = req.params;

    let existing = await db.getByEmail(email);

    if (existing) {
      await db.delete(email);

      return res.json({
        messages: [{ variant: "success", text: "User deleted" }],
      });
    }

    res.status(404).send();
  }
);
userRouter.post("/search-directory", async (req: Request, res: Response) => {
  let { terms } = req.body;

  let directoryService = new DirectoryService();
  await directoryService.connect();
  let results = await directoryService.search(terms);

  return res.json({ data: results });
});
