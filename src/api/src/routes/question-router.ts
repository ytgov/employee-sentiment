import express, { Request, Response } from "express";
import { ReturnValidationErrors } from "../middleware";
import { param } from "express-validator";
import * as knex from "knex";
import { DB_CONFIG } from "../config";
import { AnswerService, EmailService, ParticipantService, QuestionService } from "../services";
import { checkJwt, loadUser } from "../middleware/authz.middleware";
import { Answer } from "src/data/models";

export const questionRouter = express.Router();

const questionService = new QuestionService();
const emailService = new EmailService();

questionRouter.get("/", async (req: Request, res: Response) => {
  let list = await questionService.getAll();

  res.json({ data: list });
});

questionRouter.post("/", async (req: Request, res: Response) => {
  let { CURRENT_RATING_TRANCHE, DISPLAY_TEXT, MAX_ANSWERS, OWNER, RATINGS_PER_TRANCHE, STATE, TITLE } = req.body;

  let question = await questionService.create({
    CURRENT_RATING_TRANCHE,
    DISPLAY_TEXT,
    MAX_ANSWERS,
    OWNER,
    RATINGS_PER_TRANCHE,
    STATE,
    TITLE,
  });

  res.json({ data: question });
});

questionRouter.post("/:id/send-email-test", checkJwt, loadUser, async (req: Request, res: Response) => {
  const { id } = req.params;
  let { subject, body, recipients } = req.body;
  let token = "123456789";

  await emailService.sendOpinionatorEmail(
    { email: req.user.EMAIL, fullName: `${req.user.FIRST_NAME} ${req.user.LAST_NAME}` },
    subject,
    body,
    token
  );

  res.json({ data: "sent" });
});

questionRouter.post("/:id/send-email", checkJwt, loadUser, async (req: Request, res: Response) => {
  const { id } = req.params;
  let { subject, body, recipients } = req.body;
  let participants = await new ParticipantService().getByQuestionId(parseInt(id));

  if (recipients.includes("Opinionators")) {
    let opin = participants.filter((p) => p.IS_RESPONDER == 1);

    for (let part of opin) {
      await emailService.sendOpinionatorEmail({ email: part.EMAIL, fullName: `` }, subject, body, part.RANDOM_NOUNCE);
    }
  }
  if (recipients.includes("Raters")) {
    let opin = participants.filter((p) => p.IS_RATER == 1);

    for (let part of opin) {
      await emailService.sendOpinionatorEmail({ email: part.EMAIL, fullName: `` }, subject, body, part.RANDOM_NOUNCE);
    }
  }

  res.json({ data: "sent" });
});

questionRouter.put("/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  let { CURRENT_RATING_TRANCHE, DISPLAY_TEXT, MAX_ANSWERS, OWNER, RATINGS_PER_TRANCHE, STATE, TITLE } = req.body;

  let question = await questionService.update(parseInt(id), {
    CURRENT_RATING_TRANCHE,
    DISPLAY_TEXT,
    MAX_ANSWERS,
    OWNER,
    RATINGS_PER_TRANCHE,
    STATE,
    TITLE,
  });

  res.json({ data: question });
});

questionRouter.get("/:id/events", async (req: Request, res: Response) => {
  let { id } = req.params;

  let list = [
    {
      ID: 12,
      TITLE: "Opinionator list created",
      CREATE_DATE: new Date(),
      QUESTION_ID: id,
      user: { display_name: "Michael Johnson" },
    },
    {
      ID: 12,
      TITLE: "Opinionator email sent to 46 participants",
      CREATE_DATE: new Date(),
      QUESTION_ID: id,
      user: { display_name: "Eckhard Krabel" },
    },
  ];

  res.json({ data: list });
});

questionRouter.get(
  "/:token",
  [param("token").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { token } = req.params;

    let payload = await returnQuestion(token, false);
    if (payload) return res.json(payload);

    res.status(404).send();
  }
);

questionRouter.get(
  "/:token/preview",
  [param("token").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const db = knex.knex(DB_CONFIG);
    let { token } = req.params;

    let survey = await db("SRVT.SURVEY").where({ SID: token }).first();

    if (survey) {
      let questions = await db("SRVT.QUESTION").where({ SID: token }).orderBy("ORD");
      return res.json({ data: { survey, questions } });
    }
    res.status(404).send();
  }
);

questionRouter.post(
  "/:token",
  [param("token").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { token } = req.params;
    let { answer } = req.body;

    let participant = await new ParticipantService().getByToken(token);

    if (participant) {
      let newAnswer = {
        ANSWER_TEXT: answer,
        QUESTION_ID: participant.QUESTION_ID,
        HEADING: "Uknown",
        IS_EXTRA: 0,
      } as Answer;

      await questionService.createAnswer(newAnswer);
      await new ParticipantService().incrementAnswerCount(token);

      let payload = await returnQuestion(token, true);
      if (payload) return res.json(payload);
    }
    res.status(404).send("Not found");
  }
);

// This route is only temporary to test for submissions
questionRouter.get(
  "/:token/answers",
  [param("token").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const db = knex.knex(DB_CONFIG);
    let { token } = req.params;
    let answers = await db("SRVT.RESPONSE_LINE").where({ TOKEN: token });
    return res.json({ data: answers });
  }
);

async function returnQuestion(token: string, justAdded: boolean) {
  let participant = await new ParticipantService().getByToken(token);

  if (participant) {
    let question = await questionService.getById(participant.QUESTION_ID);

    if (question) {
      if (!justAdded && participant.ANSWERS_SUBMITTED >= question.MAX_ANSWERS)
        return { error: { message: "You have already submitted the maximum number of answers" } };

      let q = question as any;

      delete q.OWNER;
      delete q.CREATE_DATE;
      delete q.RATINGS_PER_TRANCHE;
      delete q.STATE;
      delete q.CURRENT_RATING_TRANCHE;

      q.answer_count = participant.ANSWERS_SUBMITTED;
      q.answers_remaining = question.MAX_ANSWERS - participant.ANSWERS_SUBMITTED;

      return { data: q };
    }
  }

  return undefined;
}
