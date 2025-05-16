import express, { Request, Response } from "express";
import { requireAdminOrOwner, ReturnValidationErrors } from "../middleware";
import { param } from "express-validator";
import { AnswerService, EmailService, ParticipantService, QuestionService } from "../services";
import { checkJwt, loadUser } from "../middleware/authz.middleware";
import { Answer, QuestionState } from "../data/models";
import { reverse, sortBy } from "lodash";
import { Knex } from "knex";

export const questionRouter = express.Router();

const questionService = new QuestionService();
const answerService = new AnswerService();
const participantService = new ParticipantService();
const emailService = new EmailService();

questionRouter.get("/", checkJwt, loadUser, requireAdminOrOwner, async (req: Request, res: Response) => {
  const query = function (q: Knex.QueryBuilder) {
    return q;
  };

  let list = await questionService.getAll(query);

  if (req.user.IS_OWNER == "Y") {
    list = list.filter((q) => q.owners?.includes(req.user.EMAIL));
  }

  res.json({ data: list });
});

questionRouter.post("/", checkJwt, loadUser, requireAdminOrOwner, async (req: Request, res: Response) => {
  let {
    CURRENT_RATING_TRANCHE,
    DISPLAY_TEXT,
    MAX_ANSWERS,
    OWNER,
    RATINGS_PER_TRANCHE,
    STATE,
    TITLE,
    MODERATABLE,
    ZERO_RATING_FLAG,
    MAX_LENGTH,
    moderators,
    owners,
  } = req.body;

  if (req.user.IS_OWNER == "Y") {
    owners = [req.user.EMAIL];
    OWNER = req.user.EMAIL;
  }

  let question = await questionService.create({
    CURRENT_RATING_TRANCHE,
    DISPLAY_TEXT,
    MAX_ANSWERS,
    OWNER,
    RATINGS_PER_TRANCHE,
    STATE,
    TITLE,
    MODERATABLE,
    ZERO_RATING_FLAG,
    MAX_LENGTH,
    QUESTION_NOUNCE: makeToken(),
  });

  await questionService.setModerators(question[0].ID, moderators ?? []);
  await questionService.setOwners(question[0].ID, owners ?? []);

  res.json({ data: question });
});

questionRouter.post(
  "/:id/send-email-test",
  checkJwt,
  loadUser,
  requireAdminOrOwner,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    let { subject, body, recipients } = req.body;
    let token = "123456789";

    await questionService.update(parseInt(id), { EMAIL_SUBJECT: subject, EMAIL_BODY: body });

    if (recipients.includes("Opinionators")) {
      await emailService.sendOpinionatorEmail(
        { email: req.user.EMAIL, fullName: `${req.user.FIRST_NAME} ${req.user.LAST_NAME}` },
        `[TEST EMAIL]: ${subject}`,
        body,
        token,
        ""
      );

      await questionService.createEvent(parseInt(id), "Opinionator test email sent", `By: ${req.user.EMAIL}`);
    }
    if (recipients.includes("Raters")) {
      await emailService.sendRaterEmail(
        { email: req.user.EMAIL, fullName: `${req.user.FIRST_NAME} ${req.user.LAST_NAME}` },
        `[TEST EMAIL]: ${subject}`,
        body,
        token,
        ""
      );

      await questionService.createEvent(parseInt(id), "Opinionator test email sent", `By: ${req.user.EMAIL}`);
    }

    res.json({ data: "sent" });
  }
);

questionRouter.post("/:id/send-email", checkJwt, loadUser, requireAdminOrOwner, async (req: Request, res: Response) => {
  const { id } = req.params;
  let { subject, body, recipients } = req.body;
  let participants = await new ParticipantService().getByQuestionId(parseInt(id));
  let question = await questionService.getById(parseInt(id));

  await questionService.update(parseInt(id), { EMAIL_SUBJECT: subject, EMAIL_BODY: body });

  if (question && recipients.includes("Opinionators")) {
    let opin = participants.filter((p) => p.IS_RESPONDER == 1);

    for (let part of opin) {
      await emailService.sendOpinionatorEmail(
        { email: part.EMAIL, fullName: `` },
        subject,
        body,
        part.RANDOM_NOUNCE,
        question.QUESTION_NOUNCE
      );
    }

    await questionService.createEvent(
      parseInt(id),
      `Opinionators email sent - ${opin.length} emails`,
      `By: ${req.user.EMAIL}`
    );
  }
  if (question && recipients.includes("Raters")) {
    let opin = participants.filter((p) => p.IS_RATER == 1);

    for (let part of opin) {
      await emailService.sendRaterEmail(
        { email: part.EMAIL, fullName: `` },
        subject,
        body,
        part.RANDOM_NOUNCE,
        question.QUESTION_NOUNCE
      );
    }

    await questionService.createEvent(
      parseInt(id),
      `Raters email sent - ${opin.length} emails`,
      `By: ${req.user.EMAIL}`
    );
  }

  res.json({ data: "sent" });
});

questionRouter.put("/:id", checkJwt, loadUser, requireAdminOrOwner, async (req: Request, res: Response) => {
  let { id } = req.params;
  let {
    CURRENT_RATING_TRANCHE,
    DISPLAY_TEXT,
    MAX_ANSWERS,
    OWNER,
    RATINGS_PER_TRANCHE,
    STATE,
    TITLE,
    MODERATABLE,
    ZERO_RATING_FLAG,
    QUESTION_NOUNCE,
    MAX_LENGTH,
    moderators,
    owners,
  } = req.body;

  let question = await questionService.update(parseInt(id), {
    CURRENT_RATING_TRANCHE,
    DISPLAY_TEXT,
    MAX_ANSWERS,
    OWNER,
    RATINGS_PER_TRANCHE,
    STATE,
    TITLE,
    MODERATABLE,
    ZERO_RATING_FLAG,
    QUESTION_NOUNCE: QUESTION_NOUNCE || makeToken(),
    MAX_LENGTH,
  });

  await questionService.setModerators(parseInt(id), moderators ?? []);
  await questionService.setOwners(parseInt(id), owners ?? []);

  res.json({ data: question });
});

questionRouter.get("/:id/events", checkJwt, loadUser, requireAdminOrOwner, async (req: Request, res: Response) => {
  let { id } = req.params;

  const list = await questionService.getEvents(parseInt(id));

  res.json({ data: list });
});

questionRouter.get(
  "/preview/:questionId",
  checkJwt,
  loadUser,
  requireAdminOrOwner,
  [param("questionId").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { questionId } = req.params;

    let payload = await returnPreviewQuestion(parseInt(questionId));

    if (payload) {
      return res.json(payload);
    }

    res.status(404).send();
  }
);

questionRouter.get(
  "/:token",
  [param("token").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { token } = req.params;

    let payload = await returnQuestion(token, false);
    let validStates = [QuestionState.Opinionate, QuestionState.Inspire, QuestionState.Rate];

    if (payload) {
      if (!validStates.includes(payload.data?.STATE)) return res.status(403).send();
      return res.json(payload);
    }

    res.status(404).send();
  }
);

// display the results for a question
questionRouter.get(
  "/:questionId/admin-results",
  checkJwt,
  loadUser,
  requireAdminOrOwner,
  [param("questionId").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { questionId } = req.params;
    let question = await questionService.getById(parseInt(questionId));

    if (question) {
      // should also check for applicable state
      let answers = await answerService.getAllForQuestion(question.ID, question.ZERO_RATING_FLAG == 1);
      return res.json({ data: { question, answers: reverse(sortBy(answers, "rating")) } });
    }

    res.status(404).send();
  }
);

// display the results for a question
questionRouter.get(
  "/:questionId/results",
  checkJwt,
  loadUser,
  requireAdminOrOwner,
  [param("questionId").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { questionId } = req.params;
    let question = await questionService.getByToken(questionId);

    if (question) {
      if (question.STATE != QuestionState.Publish) return res.status(403).send();
      // should also check for applicable state
      let answers = await answerService.getAllForQuestion(question.ID, question.ZERO_RATING_FLAG == 1);
      return res.json({ data: { question, answers: reverse(sortBy(answers, "rating")) } });
    }

    res.status(404).send();
  }
);

// insire results
questionRouter.get(
  "/preview/:questionId/inspire",
  checkJwt,
  loadUser,
  requireAdminOrOwner,
  [param("questionId").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { questionId } = req.params;

    let question = await questionService.getById(parseInt(questionId));

    if (question) {
      // should also check for applicable state
      (question as any).answers_remaining = question.MAX_ANSWERS;
      let answers = await answerService.getAllForQuestion(question.ID, question.ZERO_RATING_FLAG == 1);

      return res.json({ data: { question, answers } });
    }

    res.status(404).send();
  }
);

// insire results
questionRouter.get(
  "/:token/inspire",
  [param("token").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { token } = req.params;

    let participant = await new ParticipantService().getByToken(token);

    if (participant) {
      let question = await questionService.getById(participant.QUESTION_ID);

      if (question) {
        if (question.STATE != QuestionState.Inspire) return res.status(403).send();

        // should also check for applicable state
        (question as any).answers_remaining = question.MAX_ANSWERS - participant.ANSWERS_SUBMITTED;
        let answers = await answerService.getAllForQuestion(question.ID, question.ZERO_RATING_FLAG == 1);

        return res.json({ data: { question, answers } });
      }
    }

    res.status(404).send();
  }
);

questionRouter.get(
  "/preview/:questionId/responses",
  checkJwt,
  loadUser,
  requireAdminOrOwner,
  [param("questionId").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { questionId } = req.params;
    let question = await returnPreviewQuestion(parseInt(questionId));

    if (question && question.data && question.data.ID) {
      let answers = await answerService.getSampleForQuestion(question.data.ID, question.data.RATINGS_PER_TRANCHE, 0);
      return res.json({ data: answers });
    }

    res.status(404).send();
  }
);

questionRouter.get(
  "/:token/responses",
  [param("token").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { token } = req.params;
    let question = await returnQuestion(token, false);
    let participant = await participantService.getByToken(token);

    if (participant && question && question.data && question.data.ID) {
      let answers = await answerService.getSampleForQuestion(
        question.data.ID,
        question.data.RATINGS_PER_TRANCHE,
        participant.ID
      );
      return res.json({ data: answers });
    }

    res.status(404).send();
  }
);

questionRouter.post(
  "/:token/responses/:answerId",
  [param("token").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { token, answerId } = req.params;
    let { rating } = req.body;
    let participant = await participantService.getByToken(token);

    if (participant) {
      //let answer = await answerService.getById(parseInt(answerId));
      await answerService.saveRating(participant.ID, parseInt(answerId), 1, rating);

      return res.json({ data: "success" });
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
        OWNER_HASH: participant.RANDOM_NOUNCE,
      } as Answer;

      await questionService.createAnswer(newAnswer);
      await new ParticipantService().incrementAnswerCount(token);

      let payload = await returnQuestion(token, true);
      if (payload) return res.json(payload);
    }
    res.status(404).send("Not found");
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
      //delete q.RATINGS_PER_TRANCHE;
      delete q.CURRENT_RATING_TRANCHE;

      q.answer_count = participant.ANSWERS_SUBMITTED;
      q.answers_remaining = question.MAX_ANSWERS - participant.ANSWERS_SUBMITTED;
      q.p_is_rater = participant.IS_RATER == 1;
      q.p_is_responder = participant.IS_RESPONDER == 1;

      return { data: q };
    }
  }

  return undefined;
}

async function returnPreviewQuestion(questionId: number) {
  let question = await questionService.getById(questionId);

  if (question) {
    let q = question as any;

    delete q.OWNER;
    delete q.CREATE_DATE;
    delete q.CURRENT_RATING_TRANCHE;

    q.answer_count = 0;
    q.answers_remaining = question.MAX_ANSWERS;
    q.p_is_rater = true;
    q.p_is_responder = true;

    return { data: q };
  }
}

function makeToken() {
  const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from({ length: 24 }, (v, k) => chars[Math.floor(Math.random() * chars.length)]);

  const randomString = randomArray.join("");
  return randomString;
}
