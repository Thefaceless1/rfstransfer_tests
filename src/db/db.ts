import pkg from 'pg';
const { Client } = pkg;
import {dbConfig} from "./db.config.js";
import {InstructionStateIds} from "../helpers/enums/InstructionStateIds";
class DbHelper {
    constructor() {
    }
    /**
     * Проставление выбранного статуса для инструкции
     */
    public async updateInstructionState(state: InstructionStateIds, instructionId: number): Promise<void> {
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = 'UPDATE rfstran.instructions SET state_id=$1 WHERE id=$2';
        const values: string[] = [`${state}`,`${instructionId}`];
        await client.query(queryText,values);
        await client.end();
    }
    /**
     * Удаление договоров/доп. соглашений
     */
    public async deleteContracts(): Promise<void> {
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = 'DELETE FROM rfstran.contracts WHERE number LIKE $1'
        const values: string[] = ['тест|%'];
        await client.query(queryText,values);
        await client.end();
    }
    /**
     * Удаление инструкции
     */
    public async deleteInstructions(instructionIds: number[]): Promise<void> {
        const client: pkg.Client = new Client(dbConfig);
        await client.connect();
        const queryText: string = 'DELETE FROM rfstran.instructions WHERE id=$1';
        for(const id of instructionIds) {
            const values: string[] = [`${id}`];
            await client.query(queryText,values);
        }
        await client.end();
    }
}
export const dbHelper = new DbHelper();