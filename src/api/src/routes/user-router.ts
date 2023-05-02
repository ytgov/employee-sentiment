import express, { Request, Response } from "express";
import { UserService } from "../services";
import { checkJwt, loadUser } from "../middleware/authz.middleware";
import { param } from "express-validator";
import { ReturnValidationErrors } from "../middleware";

export const userRouter = express.Router();

userRouter.use(checkJwt);
userRouter.use(loadUser);

const db = new UserService();

userRouter.get("/me", async (req: Request, res: Response) => {
  return res.json({ data: req.user });
});

userRouter.get("/", async (req: Request, res: Response) => {
  let users = await db.getAll();

  for (let user of users) {
    user.display_name = `${user.FIRST_NAME} ${user.LAST_NAME}`;
  }

  return res.json({ data: users });
});

userRouter.put(
  "/:email",
  [param("email").notEmpty().isString()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { email } = req.params;
    let { STATUS, IS_ADMIN } = req.body;

    let existing = await db.getByEmail(email);

    if (existing) {
      existing.STATUS = STATUS;
      existing.IS_ADMIN = IS_ADMIN;

      await db.update(email, existing);

      return res.json({
        messages: [{ variant: "success", text: "User saved" }],
      });
    }

    res.status(404).send();
  }
);
