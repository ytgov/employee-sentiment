import { DB_SCHEMA, DB_ANSWER_TABLE } from "../config";
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
}
