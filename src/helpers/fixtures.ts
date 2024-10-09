import {test as base} from '@playwright/test';
import {InstructionPage} from "../pages/InstructionPage";
import {dbHelper} from "../db/DbHelper";
import {InstructionTypes} from "./enums/InstructionTypes";
import {TransferAgreementRentSubTypes} from "./enums/TransferAgreementRentSubTypes";

type Fixtures = {
    employmentContract: InstructionPage,
    additionalAgreement: InstructionPage,
    transfer: InstructionPage,
    transferLeaseBuyout: InstructionPage,
    transferRent: InstructionPage,
    transferRentProlongation: InstructionPage,
    transferRentEarlyFinish: InstructionPage,
    intTransfer: InstructionPage
    intTransferGiveAwayProfessional: InstructionPage
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
    transfer: async ({page},use) => {
        const transfer = new InstructionPage(page);
        await dbHelper.deleteInstructions(transfer.personId);
        await transfer.authorization();
        await transfer.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: transfer.srcClubId
        });
        await use(transfer);
        await dbHelper.deleteInstructions(transfer.personId);
    },
    transferLeaseBuyout: async ({page},use) => {
        const transferLeaseBuyout = new InstructionPage(page);
        await dbHelper.deleteInstructions(transferLeaseBuyout.personId);
        await transferLeaseBuyout.authorization();
        await transferLeaseBuyout.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: transferLeaseBuyout.srcClubId
        });
        await transferLeaseBuyout.addTestInstruction({
            type: InstructionTypes.transferAgreementOnRentTerms,
            subType: TransferAgreementRentSubTypes.toRent,
            clubId: transferLeaseBuyout.clubId
        });
        await use(transferLeaseBuyout);
        await dbHelper.deleteInstructions(transferLeaseBuyout.personId);
    },
    transferRent: async ({page},use) => {
        const transferRent = new InstructionPage(page);
        await dbHelper.deleteInstructions(transferRent.personId);
        await transferRent.authorization();
        await transferRent.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: transferRent.srcClubId
        });
        await use(transferRent);
        await dbHelper.deleteInstructions(transferRent.personId);
    },
    transferRentProlongation: async ({page},use)=> {
        const transferRentProlongation = new InstructionPage(page);
        await dbHelper.deleteInstructions(transferRentProlongation.personId);
        await transferRentProlongation.authorization();
        await transferRentProlongation.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: transferRentProlongation.srcClubId
        });
        await transferRentProlongation.addTestInstruction({
            type: InstructionTypes.transferAgreementOnRentTerms,
            subType: TransferAgreementRentSubTypes.toRent,
            clubId: transferRentProlongation.clubId
        });
        await use(transferRentProlongation);
        await dbHelper.deleteInstructions(transferRentProlongation.personId);
    },
    transferRentEarlyFinish: async ({page},use)=> {
        const transferRentEarlyFinish = new InstructionPage(page);
        await dbHelper.deleteInstructions(transferRentEarlyFinish.personId);
        await transferRentEarlyFinish.authorization();
        await transferRentEarlyFinish.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: transferRentEarlyFinish.earlyFinishSrcClubId
        });
        await transferRentEarlyFinish.addTestInstruction({
            type: InstructionTypes.transferAgreementOnRentTerms,
            subType: TransferAgreementRentSubTypes.toRent,
            clubId: transferRentEarlyFinish.earlyFinishSrcClubId,
            isInstructionForEarlyFinish: true
        });
        await transferRentEarlyFinish.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: transferRentEarlyFinish.srcClubId
        });
        await transferRentEarlyFinish.addTestInstruction({
            type: InstructionTypes.transferAgreementOnRentTerms,
            subType: TransferAgreementRentSubTypes.toRent,
            clubId: transferRentEarlyFinish.clubId
        });
        await use(transferRentEarlyFinish);
        await dbHelper.deleteInstructions(transferRentEarlyFinish.personId);
    },
    intTransfer: async ({page},use) => {
        const intTransferAccept = new InstructionPage(page);
        await dbHelper.deleteInstructions(intTransferAccept.personId);
        await intTransferAccept.authorization();
        await use(intTransferAccept);
        await dbHelper.deleteInstructions(intTransferAccept.personId);
    },
    intTransferGiveAwayProfessional: async ({page},use) => {
        const intTransferGiveAwayProfessional = new InstructionPage(page);
        await dbHelper.deleteInstructions(intTransferGiveAwayProfessional.personId);
        await intTransferGiveAwayProfessional.authorization();
        await intTransferGiveAwayProfessional.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: intTransferGiveAwayProfessional.srcClubId
        });
        await intTransferGiveAwayProfessional.addTestInstruction({
            type: InstructionTypes.transferAgreementOnRentTerms,
            subType: TransferAgreementRentSubTypes.toRent,
            clubId: intTransferGiveAwayProfessional.clubId
        });
        await use(intTransferGiveAwayProfessional);
        await dbHelper.deleteInstructions(intTransferGiveAwayProfessional.personId);
    }
})

