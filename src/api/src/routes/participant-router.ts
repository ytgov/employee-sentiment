import express, { Request, Response } from "express";
import { ParticipantService, QuestionService } from "../services";
import { Participant } from "../data/models";
import { checkJwt, loadUser } from "../middleware/authz.middleware";
import { requireAdmin } from "../middleware";

export const participantRouter = express.Router();

const participantService = new ParticipantService();
const questionService = new QuestionService();

participantRouter.get("/", checkJwt, loadUser, requireAdmin, async (req: Request, res: Response) => {
  let list = await participantService.getAll();

  res.json({ data: list });
});

participantRouter.post("/", checkJwt, loadUser, requireAdmin, async (req: Request, res: Response) => {
  let { addresses, participant_type, question } = req.body;

  for (let address of addresses) {
    let p = {} as Participant;
    p.IS_RESPONDER = participant_type == "Opinionator" ? 1 : 0;
    p.IS_RATER = participant_type == "Rater" ? 1 : 0;
    p.QUESTION_ID = question;
    p.EMAIL = address;
    p.RANDOM_NOUNCE = makeToken();

    await participantService.create(p);
  }

  await questionService.createEvent(
    parseInt(question),
    `Participants added - ${addresses.length} emails`,
    `By: ${req.user.EMAIL}`
  );

  res.json({ data: "TEST" });
});

participantRouter.get("/:id", checkJwt, loadUser, requireAdmin, async (req: Request, res: Response) => {
  let { id } = req.params;
  let participants = await participantService.getByQuestionId(parseInt(id));

  res.json({ data: participants });
});

participantRouter.put("/:id", checkJwt, loadUser, requireAdmin, async (req: Request, res: Response) => {
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

participantRouter.delete("/:id", checkJwt, loadUser, requireAdmin, async (req: Request, res: Response) => {
  let { id } = req.params;

  await participantService.delete(parseInt(id));

  res.json({ data: "TEST" });
});

function makeToken() {
  const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from({ length: 24 }, (v, k) => chars[Math.floor(Math.random() * chars.length)]);

  const randomString = randomArray.join("");
  return randomString;
}
