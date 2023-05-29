import express, { Request, Response } from "express";
import { ReturnValidationErrors } from "../middleware";
import { param } from "express-validator";
import * as knex from "knex";
import { DB_CONFIG } from "../config";
import { QuestionService } from "../services";

export const questionRouter = express.Router();

const questionService = new QuestionService();

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
    const db = knex.knex(DB_CONFIG);
    let { token } = req.params;

    let participant = await db("SRVT.PARTICIPANT")
      .join("SRVT.PARTICIPANT_DATA", "PARTICIPANT.TOKEN", "PARTICIPANT_DATA.TOKEN")
      .where({ "PARTICIPANT.TOKEN": token })
      .whereNotNull("EMAIL")
      .select("PARTICIPANT.*")
      .first()
      .then((r) => r)
      .catch((err) => {
        console.log("DATABASE CONNECTION ERROR", err);
        res.status(500).send(err);
      });

    if (participant) {
      let survey = await db("SRVT.SURVEY").where({ SID: participant.SID }).first();
      let questions = await db("SRVT.QUESTION").where({ SID: participant.SID }).orderBy("ORD");

      return res.json({ data: { survey, questions } });
    }

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
    const db = knex.knex(DB_CONFIG);
    let { token } = req.params;
    let { questions, contact } = req.body;

    let participant = await db("SRVT.PARTICIPANT")
      .join("SRVT.PARTICIPANT_DATA", "PARTICIPANT.TOKEN", "PARTICIPANT_DATA.TOKEN")
      .where({ "PARTICIPANT.TOKEN": token })
      .whereNotNull("EMAIL")
      .select("PARTICIPANT.*", "PARTICIPANT_DATA.EMAIL")
      .first();

    if (participant) {
      for (let question of questions) {
        let id = question.QID;
        let answer = question.answer;
        let answer_text = question.answer_text;

        let ans: any = {
          TOKEN: token,
          QID: id,
        };

        if (typeof answer == "number") ans.NVALUE = answer;
        else if (Array.isArray(answer)) ans.TVALUE = JSON.stringify(answer);
        else ans.TVALUE = answer;

        if (answer_text && answer_text.length > 0) {
          ans.TVALUE = answer_text;
        }

        await db("SRVT.RESPONSE_LINE").insert(ans);
      }

      await db("SRVT.PARTICIPANT_DATA").where({ TOKEN: token }).update({ EMAIL: null, RESPONSE_DATE: new Date() });

      if (contact) {
        await db("SRVT.CONTACT_REQUEST").insert({
          SID: participant.SID,
          REQUEST_EMAIL: participant.EMAIL,
          EMAILED_CHECK: "N",
        });
      }

      return res.json({ data: {}, messages: [{ variant: "success" }] });
    }

    res.status(404).send("Sorry, it appears that you have already completed this survey.");
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
