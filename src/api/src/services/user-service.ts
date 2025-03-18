import { DB_SCHEMA, DB_USER_QUESTION_TABLE, DB_USER_TABLE } from "../config";
import { db } from "../data";
import { User, User_Create, User_Update } from "../data/models";
import { GenericService } from "./generic-service";

export class UserService implements GenericService<User> {
  async getAll(): Promise<User[]> {
    return db.withSchema(DB_SCHEMA).from(DB_USER_TABLE).orderBy(["FIRST_NAME", "LAST_NAME"]);
  }

  async getBySub(USER_ID: string): Promise<User | undefined> {
    let user = await db<User>(DB_USER_TABLE).withSchema(DB_SCHEMA).where({ USER_ID }).first();
    return user;
  }

  async getByEmail(EMAIL: string): Promise<User | undefined> {
    if (EMAIL) {
      let user = await db<User>(DB_USER_TABLE).withSchema(DB_SCHEMA).where({ EMAIL }).first();
      return user;
    }

    return undefined;
  }

  async create(item: User_Create): Promise<any> {
    return db(DB_USER_TABLE).withSchema(DB_SCHEMA).insert(item);
  }

  async update(EMAIL: string, item: User_Update): Promise<User> {
    return db(DB_USER_TABLE).withSchema(DB_SCHEMA).where({ EMAIL }).update(item);
  }

  async delete(EMAIL: string): Promise<void> {
    await db(DB_USER_QUESTION_TABLE).withSchema(DB_SCHEMA).where({ EMAIL }).delete();
    return db(DB_USER_TABLE).withSchema(DB_SCHEMA).where({ EMAIL }).delete();
  }
}
