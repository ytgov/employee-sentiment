import express, { Request, Response } from "express";
import { ReturnValidationErrors } from "../middleware";
import { param } from "express-validator";
import * as knex from "knex";
import { DB_CONFIG } from "../config";
import { AnswerService, EmailService, ParticipantService } from "../services";
import { checkJwt, loadUser } from "../middleware/authz.middleware";
import { Answer } from "src/data/models";

export const answerRouter = express.Router();

const answerService = new AnswerService();

answerRouter.get("/", async (req: Request, res: Response) => {
  let list = await answerService.getAll();

  res.json({ data: list });
});

answerRouter.put("/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  let { CATEGORY, DELETED_FLAG, DONE_MODERATING, MODERATED_HEADER, MODERATED_TEXT, MODERATOR_NOTES } = req.body;

  let question = await answerService.update(parseInt(id), {
    CATEGORY,
    DELETED_FLAG,
    DONE_MODERATING,
    MODERATED_HEADER,
    MODERATED_TEXT,
    MODERATOR_NOTES,
  });

  res.json({ data: question });
});
