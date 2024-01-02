import { DB_SCHEMA, DB_RATING_TABLE } from "../config";
import { db } from "../data";
import { ParticipantRating } from "../data/models";
import { GenericService } from "./generic-service";

export class ParticipantRatingService implements GenericService<ParticipantRating> {
  async getAll(): Promise<ParticipantRating[]> {
    return db.withSchema(DB_SCHEMA).from(DB_RATING_TABLE);
  }

  async getById(ID: number): Promise<ParticipantRating | undefined> {
    let rating = await db<ParticipantRating>(DB_RATING_TABLE).withSchema(DB_SCHEMA).where({ ID }).first();
    return rating;
  }

  async create(item: any): Promise<any> {
    return db(DB_RATING_TABLE).withSchema(DB_SCHEMA).insert(item).returning("*");
  }

  async update(ID: number, item: any): Promise<ParticipantRating> {
    return db(DB_RATING_TABLE).withSchema(DB_SCHEMA).where({ ID }).update(item);
  }

  async delete(ID: number): Promise<void> {
    return db(DB_RATING_TABLE).withSchema(DB_SCHEMA).where({ ID }).delete();
  }
}
