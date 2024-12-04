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
     * Удаление записей отправки сведений в ФИФА для выбранного пользователя
     */
    public async deleteFifaSending(personId: number): Promise<void> {
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = `DELETE FROM rfstran.fifa_sendings 
                                   WHERE instruction_id IN 
                                   (SELECT id FROM rfstran.instructions 
                                    WHERE ext_personid=$1)`;
        const values: string[] = [`${personId}`];
        await client.query(queryText,values);
        await client.end();
    }
    /**
     * Получение предыдущих договоров по id пользователя и id клуба
     */
    public async getPreviousContract(userId: number,clubId: number,isTemporary: boolean) {
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        let queryText: string =
            `SELECT * from rfstran.contracts 
             WHERE ext_personid=$1
             AND ext_clubid=$2
             AND state_id IN (3,4,5)
             AND labour_contract_id is null`;
        if(isTemporary) queryText+=` AND is_temporary=true`;
        queryText+=` ORDER BY (CASE state_id WHEN 3 THEN 0 ELSE 1 END), duration_begin_date DESC`;
        const values: string[] = [`${userId}`,`${clubId}`];
        const result = await client.query(queryText,values);
        return result.rows;
    }
    /**
     * Получение описания коллизии по ее id
     */
    public async getCollisionDescription(collisionId: number): Promise<string> {
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = `SELECT * FROM rfstran.nsi_collision_types 
                                   WHERE id = $1`;
        const values: string[] = [`${collisionId}`];
        const result = await client.query(queryText,values);
        if (result.rowCount == 0) throw new Error(`Отсутствует коллизия с id: ${collisionId}`);
        else if (result.rows[0]["is_fatal"] == true) throw new Error(`Коллизия '${result.rows[0].description}' является критичной`);
        return result.rows[0].description;
    }
    /**
     * Получение значения флага отправки сведений в ФИФА
     */
    public async getFifaSendingFlagState(): Promise<string> {
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = `SELECT * FROM rfstran.work_params
                                   WHERE sys_name = 'FIFA_Send'`;
        const result = await client.query(queryText);
        return result.rows[0].value;
    }
    /**
     * Получение данных из таблицы 'fifa_sendings' по указанному 'instructionId' и "typeId"
     */
    public async getFifaSendingData(instructionId: number, actionType: number): Promise<any[]> {
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = `SELECT * FROM rfstran.fifa_sendings 
                                   WHERE instruction_id = $1 
                                   AND type_id = $2`;
        const values: string[] = [`${instructionId}`,`${actionType}`];
        const result = await client.query(queryText,values);
        return result.rows;
    }
}
export const dbHelper = new DbHelper();