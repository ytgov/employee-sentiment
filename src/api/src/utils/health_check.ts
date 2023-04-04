import { DB_CONFIG } from "../config";
import { Response } from "express";
import knex from "knex";
import { EmailService } from "../services";

export async function doHealthCheck(res: Response) {
  let database = await testDatabaseConnection();
  let schema = await testSchemaExists();
  let email = await testEmailServer();
  let health_good = database.connection && schema.connection && email.connection;

  return res.json({
    application_date: new Date(),
    health_good,
    database,
    schema,
    email,
  });
}

async function testDatabaseConnection() {
  try {
    const db = knex(DB_CONFIG);
    let t = await db.raw("select SYSDATE database_time FROM dual ");
    return Object.assign(t[0], { connection: true });
  } catch (e: any) {
    console.log("DB ERROR: ", e.message);
    return { connection: false, message: e.message };
  }
}

async function testSchemaExists() {
  try {
    const db = knex(DB_CONFIG);
    let t = await db.raw(
      "select count(t.name) as table_count from sys.tables t inner join sys.schemas s on t.schema_id = s.schema_id  where s.name = 'sfa'"
    );
    return Object.assign(t[0], { connection: true });
  } catch (e: any) {
    console.log("DB ERROR: ", e.message);
    return { connection: false, message: e.message };
  }
}

async function testEmailServer() {
  const emailer = new EmailService();
  let t = await emailer.verify();
  return t;
}
