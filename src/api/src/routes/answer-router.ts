import express, { Request, Response } from "express";
import { AnswerService } from "../services";
import { checkJwt, loadUser } from "../middleware/authz.middleware";
import { requireAdmin } from "../middleware";

export const answerRouter = express.Router();

const answerService = new AnswerService();

answerRouter.get("/", checkJwt, loadUser, requireAdmin, async (req: Request, res: Response) => {
  let list = await answerService.getAll();

  res.json({ data: list });
});

answerRouter.put("/:id", checkJwt, loadUser, requireAdmin, async (req: Request, res: Response) => {
  let { id } = req.params;
  let { CATEGORY, DELETED_FLAG, DONE_MODERATING, MODERATED_HEADER, MODERATED_TEXT, MODERATOR_NOTES } = req.body;

  let question = await answerService.update(parseInt(id), {
    CATEGORY,
    DELETED_FLAG,
    DONE_MODERATING,
    MODERATED_HEADER,
    MODERATED_TEXT,
    MODERATOR_NOTES,
    MODERATED_BY: req.user.EMAIL,
  });

  res.json({ data: question });
});
