import { DB_SCHEMA, DB_PARTICIPANT_TABLE } from "../config";
import { db } from "../data";
import { Participant } from "../data/models";
import { GenericService } from "./generic-service";

export class ParticipantService implements GenericService<Participant> {
  async getAll(): Promise<Participant[]> {
    return db.withSchema(DB_SCHEMA).from(DB_PARTICIPANT_TABLE);
  }

  async getById(ID: number): Promise<Participant | undefined> {
    let participant = await db<Participant>(DB_PARTICIPANT_TABLE).withSchema(DB_SCHEMA).where({ ID }).first();
    return participant;
  }

  async getByToken(RANDOM_NOUNCE: string): Promise<Participant | undefined> {
    return db<Participant>(DB_PARTICIPANT_TABLE).withSchema(DB_SCHEMA).where({ RANDOM_NOUNCE }).first();
  }

  async incrementAnswerCount(RANDOM_NOUNCE: string): Promise<Participant | undefined> {
    return db<any>(DB_PARTICIPANT_TABLE)
      .withSchema(DB_SCHEMA)
      .where({ RANDOM_NOUNCE })
      .update({ ANSWERS_SUBMITTED: db.raw(`"ANSWERS_SUBMITTED" + 1`) });
  }

  async getByQuestionId(QUESTION_ID: number): Promise<Participant[]> {
    return db<Participant>(DB_PARTICIPANT_TABLE).withSchema(DB_SCHEMA).where({ QUESTION_ID });
  }

  async create(item: any): Promise<any> {
    let existing = await db(DB_PARTICIPANT_TABLE)
      .withSchema(DB_SCHEMA)
      .where({ EMAIL: item.EMAIL, QUESTION_ID: item.QUESTION_ID });

    // only insert if it's not already there
    if (existing && existing.length > 0) {
      let existingRater = existing.filter((e) => e.IS_RATER == 1);
      let existingResponder = existing.filter((e) => e.IS_RESPONDER == 1);

      if (item.IS_RATER && existingRater.length == 0)
        return db(DB_PARTICIPANT_TABLE).withSchema(DB_SCHEMA).insert(item).returning("*");
      if (item.IS_RESPONDER && existingResponder.length == 0)
        return db(DB_PARTICIPANT_TABLE).withSchema(DB_SCHEMA).insert(item).returning("*");
    } else {
      return db(DB_PARTICIPANT_TABLE).withSchema(DB_SCHEMA).insert(item).returning("*");
    }
  }

  async update(ID: number, item: any): Promise<Participant> {
    return db(DB_PARTICIPANT_TABLE).withSchema(DB_SCHEMA).where({ ID }).update(item);
  }

  async delete(ID: number): Promise<void> {
    return db(DB_PARTICIPANT_TABLE).withSchema(DB_SCHEMA).where({ ID }).delete();
  }
}
