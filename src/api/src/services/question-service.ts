import { DB_SCHEMA, DB_QUESTION_TABLE } from "../config";
import { db } from "../data";
import { Question } from "../data/models";
import { GenericService } from "./generic-service";

export class QuestionService implements GenericService<Question> {
  async getAll(): Promise<Question[]> {
    return db.withSchema(DB_SCHEMA).from(DB_QUESTION_TABLE);
  }

  async getById(ID: number): Promise<Question | undefined> {
    let question = await db<Question>(DB_QUESTION_TABLE).withSchema(DB_SCHEMA).where({ ID }).first();
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
}
