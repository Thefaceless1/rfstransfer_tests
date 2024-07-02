import pkg from 'pg';
const { Client } = pkg;
import {dbConfig} from "./db.config.js";
class DbHelper {
    constructor() {
    }
    /**
     * Удаление инструкций для выбранного пользователя
     */
    public async deleteInstructions(personId: number): Promise<void> {
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = `DELETE FROM rfstran.instructions 
                                   WHERE ext_personid=$1`;
        const values: string[] = [`${personId}`];
        await client.query(queryText,values);
        await client.end();
    }
    /**
     * Получение предыдущих договоров по id пользователя и id клуба
     */
    public async getPreviousContract(userId: number,clubId: number) {
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = `SELECT * from rfstran.contracts 
                                   WHERE ext_personid=$1 
                                   AND ext_clubid=$2
                                   AND state_id IN (3,4,5)
                                   AND labour_contract_id is null
                                   ORDER BY (CASE state_id WHEN 3 THEN 0 ELSE 1 END), duration_begin_date DESC`;
        const values: string[] = [`${userId}`,`${clubId}`];
        const result = await client.query(queryText,values);
        if(result.rows.length == 0) throw new Error(`Отсутствует предыдущий договор для пользователя ${userId} и клуба ${clubId}`);
        return result.rows;
    }
}
export const dbHelper = new DbHelper();