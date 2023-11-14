import pkg from 'pg';
const { Client } = pkg;
import {dbConfig} from "./db.config.js";
class DbHelper {
    private readonly client: pkg.Client = new Client(dbConfig)
}
export const dbHelper = new DbHelper();