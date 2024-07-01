import {test as base} from '@playwright/test';
import {InstructionPage} from "../pages/InstructionPage";
import {dbHelper} from "../db/DbHelper";
import {InstructionTypes} from "./enums/InstructionTypes";

type Fixtures = {
    employmentContract: InstructionPage,
    additionalAgreement: InstructionPage,
    transferAgreement: InstructionPage,
    transferAgreementRent: InstructionPage
}

export const test = base.extend<Fixtures>({
    employmentContract: async ({page},use) => {
        const employmentContract = new InstructionPage(page);
        await dbHelper.deleteInstructions(employmentContract.personId);
        await employmentContract.authorization();
        await use(employmentContract);
        await dbHelper.deleteInstructions(employmentContract.personId);
    },
    additionalAgreement: async ({page},use) => {
        const additionalAgreement = new InstructionPage(page);
        await dbHelper.deleteInstructions(additionalAgreement.personId);
        await additionalAgreement.authorization();
        await additionalAgreement.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: additionalAgreement.srcClubId
        });
        await use(additionalAgreement);
        await dbHelper.deleteInstructions(additionalAgreement.personId);
    },
    transferAgreement: async ({page},use) => {
        const transferAgreement = new InstructionPage(page);
        await dbHelper.deleteInstructions(transferAgreement.personId);
        await transferAgreement.authorization();
        await transferAgreement.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: transferAgreement.srcClubId
        });
        await transferAgreement.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: transferAgreement.clubId
        });
        await use(transferAgreement);
        await dbHelper.deleteInstructions(transferAgreement.personId);
    },
    transferAgreementRent: async ({page},use) => {
        const transferAgreementRent = new InstructionPage(page);
        await dbHelper.deleteInstructions(transferAgreementRent.personId);
        await transferAgreementRent.authorization();
        await transferAgreementRent.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: transferAgreementRent.srcClubId
        });
        await transferAgreementRent.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: transferAgreementRent.clubId
        });
        await use(transferAgreementRent);
        await dbHelper.deleteInstructions(transferAgreementRent.personId);
    }
})

