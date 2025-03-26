import { Knex } from "knex";

export interface GenericService<T> {
  getAll(where: (query: Knex.QueryBuilder) => Knex.QueryBuilder): Promise<T[]>;
}
