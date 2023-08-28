import express, { Request, Response } from "express";
import { ReturnValidationErrors } from "../middleware";
import { param } from "express-validator";
import { AnswerService, EmailService, ParticipantService, QuestionService } from "../services";
import { checkJwt, loadUser } from "../middleware/authz.middleware";
import { Answer, QuestionState } from "../data/models";
import { reverse, sortBy } from "lodash";

export const questionRouter = express.Router();

const questionService = new QuestionService();
const answerService = new AnswerService();
const participantService = new ParticipantService();
const emailService = new EmailService();

questionRouter.get("/", async (req: Request, res: Response) => {
  let list = await questionService.getAll();

  res.json({ data: list });
});

questionRouter.post("/", async (req: Request, res: Response) => {
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
    moderators,
  } = req.body;

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
    QUESTION_NOUNCE: makeToken(),
  });

  await questionService.setModerators(question[0].ID, moderators);

  res.json({ data: question });
});

questionRouter.post("/:id/send-email-test", checkJwt, loadUser, async (req: Request, res: Response) => {
  const { id } = req.params;
  let { subject, body, recipients } = req.body;
  let token = "123456789";

  console.log("eq body", req.body);

  if (recipients.includes("Opinionators")) {
    await emailService.sendOpinionatorEmail(
      { email: req.user.EMAIL, fullName: `${req.user.FIRST_NAME} ${req.user.LAST_NAME}` },
      `[TEST EMAIL]: ${subject}`,
      body,
      token,
      ""
    );
  }
  if (recipients.includes("Raters")) {
    await emailService.sendRaterEmail(
      { email: req.user.EMAIL, fullName: `${req.user.FIRST_NAME} ${req.user.LAST_NAME}` },
      `[TEST EMAIL]: ${subject}`,
      body,
      token,
      ""
    );
  }

  res.json({ data: "sent" });
});

questionRouter.post("/:id/send-email", checkJwt, loadUser, async (req: Request, res: Response) => {
  const { id } = req.params;
  let { subject, body, recipients } = req.body;
  let participants = await new ParticipantService().getByQuestionId(parseInt(id));
  let question = await questionService.getById(parseInt(id));

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
  }

  res.json({ data: "sent" });
});

questionRouter.put("/:id", async (req: Request, res: Response) => {
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
    moderators,
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
  });

  await questionService.setModerators(parseInt(id), moderators);

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
    let validStates = [QuestionState.Opinionate, QuestionState.Inspire];

    if (payload) {
      if (!validStates.includes(payload.data.STATE)) return res.status(403).send();
      return res.json(payload);
    }

    res.status(404).send();
  }
);

// display the results for a question
questionRouter.get(
  "/:questionId/results",
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
  "/:token/responses",
  [param("token").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    let { token } = req.params;
    let question = await returnQuestion(token, false);
    let participant = await participantService.getByToken(token);

    if (participant && question && question.data && question.data.ID) {
      let answers = await answerService.getSampleForQuestion(question.data.ID, 4, participant.ID);
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
      delete q.RATINGS_PER_TRANCHE;
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

function makeToken() {
  const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from({ length: 24 }, (v, k) => chars[Math.floor(Math.random() * chars.length)]);

  const randomString = randomArray.join("");
  return randomString;
}
