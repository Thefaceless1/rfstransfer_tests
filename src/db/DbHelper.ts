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
        await this.deleteContractsUndo(personId);
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = `DELETE FROM rfstran.instructions 
                                   WHERE ext_personid=$1`;
        const values: string[] = [`${personId}`];
        await client.query(queryText,values);
        await client.end();
    }
    /**
     * Удаление записей из таблицы 'contracts_undo' для выбранного пользователя
     */
    private async deleteContractsUndo(personId: number): Promise<void> {
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = `DELETE FROM rfstran.contracts_undo 
                                   WHERE person_id=$1`;
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
    /**
     * Получение списка контрактов по id инструкции
     */
    public async getInstructionContracts(instructionId: number): Promise<any[]> {
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = `SELECT * from rfstran.contracts 
                                   WHERE instruction_id = $1`;
        const values: string[] = [`${instructionId}`];
        const result = await client.query(queryText,values);
        return result.rows;
    }
    /**
     * Проверка менялся ли ТД текущей инструкции в других инструкциях
     */
    public async isContractChangedByAnotherInstruction(instructionId: number): Promise<boolean> {
        const contracts: any[] = await this.getInstructionContracts(instructionId);
        if (contracts.length == 0) return false;
        const mainContract = contracts.find(contract => contract["labour_contract_id"] == null);
        if (!mainContract) return false;
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = `SELECT exists 
                                   (SELECT 1 from rfstran.contracts_undo 
                                    WHERE contract_id = $1 
                                    AND id > (SELECT id FROM rfstran.contracts_undo 
                                              WHERE contract_id = $1 
                                              AND instruction_id = $2
                                              AND instruction_id = last_change_instruction_id))`;
        const values: string[] = [`${mainContract["id"]}`,`${instructionId}`];
        const result = await client.query(queryText,values);
        return result.rows[0].exists;
    }
    /**
     * Получение уникальных id контрактов для пользователя из таблицы изменений контрактов
     */
    public async getUserContractsUndo(personId: number): Promise<number[]>  {
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = `SELECT distinct(contract_id) 
                                                        FROM rfstran.contracts_undo 
                                                        WHERE person_id = $1 
                                                        AND actual_end_date is not null`;
        const values: string[] = [`${personId}`];
        const result = await client.query(queryText,values);
        return result.rows.map(contract => Number(contract["contract_id"]));
    }
    /**
     * Получение id записи с последним состоянием контракта из таблицы contracts_undo
     */
    public async getLastContractUndoRecordId(contractId: number): Promise<number> {
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = `SELECT id FROM rfstran.contracts_undo 
                                   WHERE contract_id = $1 
                                   ORDER BY id DESC
                                   LIMIT 1`;
        const values: string[] = [`${contractId}`];
        const result = await client.query(queryText,values);
        return Number(result.rows[0]["id"]);
    }
    /**
     * Проверка находится ли контракт в предыдущем состоянии
     */
    public async isContractInPreviousState(contractUndoRecordId: number): Promise<boolean> {
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = `SELECT exists (SELECT * FROM rfstran.contracts_undo cu
                                                  INNER JOIN rfstran.contracts c
                                                  ON cu.contract_id = c.id
                                                  AND cu.state_id = c.state_id
                                                  AND cu.is_temporary = c.is_temporary  
                                                  AND cu.duration_end_date IS NOT DISTINCT FROM c.duration_end_date
                                                  AND cu.actual_end_date IS NOT DISTINCT FROM c.actual_end_date
                                                  AND cu.stop_date IS NOT DISTINCT FROM c.stop_date
                                                  AND cu.restart_date IS NOT DISTINCT FROM c.restart_date
                                                  WHERE cu.id = $1)`;
        const values: string[] = [`${contractUndoRecordId}`];
        const result = await client.query(queryText,values);
        return result.rows[0].exists;
    }
}
export const dbHelper = new DbHelper();