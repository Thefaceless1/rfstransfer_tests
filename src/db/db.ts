import {Client} from "pg";
import {dbConfig} from "./db.config.js";

export class Db {
    private readonly client: Client = new Client(dbConfig)
}