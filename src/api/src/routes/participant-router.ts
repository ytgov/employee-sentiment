import express, { Request, Response } from "express";
import { ParticipantService } from "../services";
import { Participant } from "src/data/models";

export const participantRouter = express.Router();

const participantService = new ParticipantService();

participantRouter.get("/", async (req: Request, res: Response) => {
  let list = await participantService.getAll();

  res.json({ data: list });
});

participantRouter.post("/", async (req: Request, res: Response) => {
  let { addresses, participant_type, question } = req.body;

  for (let address of addresses) {
    let p = {} as Participant;
    p.IS_RESPONDER = participant_type == "Opinionator" ? 1 : 0;
    p.QUESTION_ID = question;
    p.EMAIL = address;
    p.RANDOM_NOUNCE = makeToken();

    await participantService.create(p);
  }

  /* let question = await participantService.create({
    CURRENT_RATING_TRANCHE,
    DISPLAY_TEXT,
    MAX_ANSWERS,
    OWNER,
    RATINGS_PER_TRANCHE,
    STATE,
    TITLE,
  }); */

  res.json({ data: "TEST" });
});

participantRouter.get("/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  let participants = await participantService.getByQuestionId(parseInt(id));

  res.json({ data: participants });
});

participantRouter.put("/:id", async (req: Request, res: Response) => {
  let { id } = req.params;
  let { CURRENT_RATING_TRANCHE, DISPLAY_TEXT, MAX_ANSWERS, OWNER, RATINGS_PER_TRANCHE, STATE, TITLE } = req.body;

  let question = await participantService.update(parseInt(id), {
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

function makeToken() {
  const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from({ length: 24 }, (v, k) => chars[Math.floor(Math.random() * chars.length)]);

  const randomString = randomArray.join("");
  return randomString;
}
