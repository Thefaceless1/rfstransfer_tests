import {ClientConfig} from "pg";

export const dbConfig: ClientConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: +process.env.DB_PORT
}