import { Knex } from "knex";
import { DB_SCHEMA, DB_QUESTION_TABLE, DB_ANSWER_TABLE, DB_USER_QUESTION_TABLE } from "../config";
import { db } from "../data";
import { Question } from "../data/models";
import { GenericService } from "./generic-service";

export class QuestionService implements GenericService<Question> {
  async getAll(where: (query: Knex.QueryBuilder) => Knex.QueryBuilder): Promise<Question[]> {
    let questions = await db<Question>(DB_QUESTION_TABLE).withSchema(DB_SCHEMA).modify(where).orderBy("TITLE");

    for (let q of questions) {
      let moderators = await db(DB_USER_QUESTION_TABLE)
        .withSchema(DB_SCHEMA)
        .where({ QUESTION_ID: q.ID, ROLE: "Moderator" })
        .select("EMAIL");
      q.moderators = moderators.map((m) => m.EMAIL);

      let owners = await db(DB_USER_QUESTION_TABLE)
        .withSchema(DB_SCHEMA)
        .where({ QUESTION_ID: q.ID, ROLE: "Owner" })
        .select("EMAIL");
      q.owners = owners.map((m) => m.EMAIL);
    }

    return questions;
  }

  async getById(ID: number): Promise<Question | undefined> {
    let question = await db<Question>(DB_QUESTION_TABLE).withSchema(DB_SCHEMA).where({ ID }).first();
    return question;
  }

  async getByToken(QUESTION_NOUNCE: string): Promise<Question | undefined> {
    let question = await db<Question>(DB_QUESTION_TABLE).withSchema(DB_SCHEMA).where({ QUESTION_NOUNCE }).first();
    return question;
  }

  async create(item: any): Promise<any> {
    return db(DB_QUESTION_TABLE).withSchema(DB_SCHEMA).insert(item).returning("*");
  }

  async update(ID: number, item: any): Promise<Question> {
    return db(DB_QUESTION_TABLE).withSchema(DB_SCHEMA).where({ ID }).update(item);
  }

  async delete(ID: number): Promise<void> {
    return db(DB_QUESTION_TABLE).withSchema(DB_SCHEMA).where({ ID }).delete();
  }

  async createAnswer(answer: any): Promise<any> {
    return db(DB_ANSWER_TABLE).withSchema(DB_SCHEMA).insert(answer);
  }

  async setModerators(QUESTION_ID: number, emails: string[]): Promise<any> {
    await db(DB_USER_QUESTION_TABLE).withSchema(DB_SCHEMA).where({ QUESTION_ID, ROLE: "Moderator" }).delete();

    let inserts = emails.map((e) => {
      return { EMAIL: e, ROLE: "Moderator", QUESTION_ID };
    });

    if (inserts.length > 0) return db(DB_USER_QUESTION_TABLE).withSchema(DB_SCHEMA).insert(inserts);
  }

  async getOwners(QUESTION_ID: number): Promise<any> {
    return await db(DB_USER_QUESTION_TABLE).withSchema(DB_SCHEMA).where({ QUESTION_ID, ROLE: "Owner" });
  }

  async setOwners(QUESTION_ID: number, emails: string[]): Promise<any> {
    await db(DB_USER_QUESTION_TABLE).withSchema(DB_SCHEMA).where({ QUESTION_ID, ROLE: "Owner" }).delete();

    let inserts = emails.map((e) => {
      return { EMAIL: e, ROLE: "Owner", QUESTION_ID };
    });

    if (inserts.length > 0) return db(DB_USER_QUESTION_TABLE).withSchema(DB_SCHEMA).insert(inserts);
  }

  async getEvents(QUESTION_ID: number): Promise<any> {
    return db("QUESTION_HISTORY").withSchema(DB_SCHEMA).where({ QUESTION_ID }).orderBy("CREATE_DATE", "desc");
  }

  async createEvent(QUESTION_ID: number, ACTION: string, DESCRIPTION: string): Promise<any> {
    return db("QUESTION_HISTORY")
      .withSchema(DB_SCHEMA)
      .insert({ QUESTION_ID, ACTION, DESCRIPTION, CREATE_DATE: new Date() });
  }
}
