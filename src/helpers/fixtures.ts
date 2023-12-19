import {test as base} from '@playwright/test';
import {InstructionPage} from "../pages/InstructionPage";
import {InstructionTypes} from "./enums/InstructionTypes";
import {dbHelper} from "../db/db";

type Fixtures = {
    employmentContract: InstructionPage,
    additionalAgreement: InstructionPage
}

export const test = base.extend<Fixtures>({
    employmentContract: async ({page},use) => {
        const employmentContract = new InstructionPage(page);
        await employmentContract.authorization();
        await use(employmentContract);
        await dbHelper.deleteContracts();
        if(employmentContract.instructionIds.length > 0) await dbHelper.deleteInstructions(employmentContract.instructionIds);
    },
    additionalAgreement: async ({page},use) => {
        const additionalAgreement = new InstructionPage(page);
        await additionalAgreement.authorization();
        await additionalAgreement.createInstruction(InstructionTypes.newEmploymentContract);
        await additionalAgreement.addContract("employmentContact");
        await use(additionalAgreement);
        await dbHelper.deleteContracts();
        if(additionalAgreement.instructionIds.length > 0) await dbHelper.deleteInstructions(additionalAgreement.instructionIds);
    }
})

