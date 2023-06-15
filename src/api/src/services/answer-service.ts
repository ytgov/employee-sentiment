import { DB_SCHEMA, DB_ANSWER_TABLE, DB_RATING_TABLE } from "../config";
import { db } from "../data";
import { Answer } from "../data/models";
import { GenericService } from "./generic-service";

export class AnswerService implements GenericService<Answer> {
  async getAll(): Promise<Answer[]> {
    return db.withSchema(DB_SCHEMA).from(DB_ANSWER_TABLE);
  }

  async getById(ID: number): Promise<Answer | undefined> {
    let answer = await db<Answer>(DB_ANSWER_TABLE).withSchema(DB_SCHEMA).where({ ID }).first();
    return answer;
  }

  async create(item: any): Promise<any> {
    return db(DB_ANSWER_TABLE).withSchema(DB_SCHEMA).insert(item).returning("*");
  }

  async update(ID: number, item: any): Promise<Answer> {
    return db(DB_ANSWER_TABLE).withSchema(DB_SCHEMA).where({ ID }).update(item);
  }

  async delete(ID: number): Promise<void> {
    return db(DB_ANSWER_TABLE).withSchema(DB_SCHEMA).where({ ID }).delete();
  }

  async getSampleForQuestion(QUESTION_ID: number, ratingsPerTranche: number): Promise<any[]> {
    let answers = await db
      .withSchema(DB_SCHEMA)
      .from(DB_ANSWER_TABLE)
      .where({ QUESTION_ID, DONE_MODERATING: 1, DELETED_FLAG: 0 });

    let payload = new Array<any>();

    // not yet rated by user
    // limit response count to ratingsPerTranche
    // answers with least number of ratings, random if equal

    for (let a of answers) {
      payload.push({ ID: a.ID, HEADING: a.MODERATED_HEADER, ANSWER_TEXT: a.MODERATED_TEXT, rating: 0 });
    }

    return payload;
  }

  async saveRating(PARTICIPANT_ID: number, ANSWER_ID: number, TRANCHE_NUMBER: number, score: number) {
    let star0 = score == 0 ? 1 : 0;
    let star1 = score == 1 ? 1 : 0;
    let star2 = score == 2 ? 1 : 0;
    let star3 = score == 3 ? 1 : 0;
    let star4 = score == 4 ? 1 : 0;
    let star5 = score == 5 ? 1 : 0;

    await db(DB_ANSWER_TABLE)
      .withSchema(DB_SCHEMA)
      .where({ ID: ANSWER_ID })
      .update({
        STAR0: db.raw(`"STAR0" + ${star0}`),
        STAR1: db.raw(`"STAR1" + ${star1}`),
        STAR2: db.raw(`"STAR2" + ${star2}`),
        STAR3: db.raw(`"STAR3" + ${star3}`),
        STAR4: db.raw(`"STAR4" + ${star4}`),
        STAR5: db.raw(`"STAR5" + ${star5}`),
      });

    return db(DB_RATING_TABLE).withSchema(DB_SCHEMA).insert({ PARTICIPANT_ID, ANSWER_ID, TRANCHE_NUMBER, ANSWERED: 1 });
  }
}
