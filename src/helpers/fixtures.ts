import {test as base} from '@playwright/test';
import {InstructionPage} from "../pages/InstructionPage";
import {dbHelper} from "../db/DbHelper";
import {InstructionTypes} from "./enums/InstructionTypes";
import {TransferAgreementRentSubTypes} from "./enums/TransferAgreementRentSubTypes";
import {TransferContractType} from "./enums/TransferContractType";
import {logService} from "../logger/LogService";
import {RegistriesPage} from "../pages/RegistriesPage";

type Fixtures = {
    employmentContract: InstructionPage,
    additionalAgreement: InstructionPage,
    transfer: InstructionPage,
    leaseBuyout: InstructionPage,
    transferRent: InstructionPage,
    rentProlongation: InstructionPage,
    earlyFinishRent: InstructionPage,
    intTransfer: InstructionPage,
    registry: RegistriesPage
}

export const test = base.extend<Fixtures>({
    employmentContract: async ({page},use,testInfo) => {
        await logService.clearLogFile();
        const employmentContract = new InstructionPage(page);
        await dbHelper.deleteFifaSending(employmentContract.personId);
        await dbHelper.deleteInstructions(employmentContract.personId);
        await employmentContract.authorization();
        await use(employmentContract);
        await dbHelper.deleteFifaSending(employmentContract.personId);
        await dbHelper.deleteInstructions(employmentContract.personId);
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    additionalAgreement: async ({page},use,testInfo) => {
        await logService.clearLogFile();
        const additionalAgreement = new InstructionPage(page);
        await dbHelper.deleteFifaSending(additionalAgreement.personId);
        await dbHelper.deleteInstructions(additionalAgreement.personId);
        await additionalAgreement.authorization();
        await additionalAgreement.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: additionalAgreement.srcClubId
        });
        await use(additionalAgreement);
        await dbHelper.deleteFifaSending(additionalAgreement.personId);
        await dbHelper.deleteInstructions(additionalAgreement.personId);
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    transfer: async ({page},use,testInfo) => {
        await logService.clearLogFile();
        const transfer = new InstructionPage(page);
        await dbHelper.deleteFifaSending(transfer.personId);
        await dbHelper.deleteInstructions(transfer.personId);
        await transfer.authorization();
        await transfer.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: transfer.srcClubId
        });
        await use(transfer);
        await dbHelper.deleteFifaSending(transfer.personId);
        await dbHelper.deleteInstructions(transfer.personId);
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    leaseBuyout: async ({page},use,testInfo) => {
        await logService.clearLogFile();
        const leaseBuyout = new InstructionPage(page);
        await dbHelper.deleteFifaSending(leaseBuyout.personId);
        await dbHelper.deleteInstructions(leaseBuyout.personId);
        await leaseBuyout.authorization();
        await leaseBuyout.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: leaseBuyout.srcClubId
        });
        await leaseBuyout.addTestInstruction(
            {
            type: InstructionTypes.transferAgreementOnRentTerms,
            subType: TransferAgreementRentSubTypes.toRent,
            clubId: leaseBuyout.clubId
            },
            TransferContractType.withSuspension
        );
        await use(leaseBuyout);
        await dbHelper.deleteFifaSending(leaseBuyout.personId);
        await dbHelper.deleteInstructions(leaseBuyout.personId);
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    transferRent: async ({page},use,testInfo) => {
        await logService.clearLogFile();
        const transferRent = new InstructionPage(page);
        await dbHelper.deleteFifaSending(transferRent.personId);
        await dbHelper.deleteInstructions(transferRent.personId);
        await transferRent.authorization();
        await transferRent.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: transferRent.srcClubId
        });
        await use(transferRent);
        await dbHelper.deleteFifaSending(transferRent.personId);
        await dbHelper.deleteInstructions(transferRent.personId);
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    rentProlongation: async ({page},use,testInfo)=> {
        await logService.clearLogFile();
        const rentProlongation = new InstructionPage(page);
        await dbHelper.deleteFifaSending(rentProlongation.personId);
        await dbHelper.deleteInstructions(rentProlongation.personId);
        await rentProlongation.authorization();
        await rentProlongation.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: rentProlongation.srcClubId
        });
        await rentProlongation.addTestInstruction(
            {
            type: InstructionTypes.transferAgreementOnRentTerms,
            subType: TransferAgreementRentSubTypes.toRent,
            clubId: rentProlongation.clubId
            },
            TransferContractType.withSuspension
        );
        await use(rentProlongation);
        await dbHelper.deleteFifaSending(rentProlongation.personId);
        await dbHelper.deleteInstructions(rentProlongation.personId);
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    earlyFinishRent: async ({page},use,testInfo)=> {
        await logService.clearLogFile();
        const transferRentEarlyFinish = new InstructionPage(page);
        await dbHelper.deleteFifaSending(transferRentEarlyFinish.personId);
        await dbHelper.deleteInstructions(transferRentEarlyFinish.personId);
        await transferRentEarlyFinish.authorization();
        await transferRentEarlyFinish.addTestInstruction({
            type: InstructionTypes.newEmploymentContract,
            clubId: transferRentEarlyFinish.clubId,
            isInstructionForEarlyFinish: true
        });
        await transferRentEarlyFinish.addTestInstruction(
            {
            type: InstructionTypes.transferAgreementOnRentTerms,
            subType: TransferAgreementRentSubTypes.toRent,
            clubId: transferRentEarlyFinish.srcClubId,
            isInstructionForEarlyFinish: true
            },
            (testInfo.title.includes("изменение ТД")) ?
                TransferContractType.withSuspension:
                TransferContractType.withTermination
        );
        await use(transferRentEarlyFinish);
        await dbHelper.deleteFifaSending(transferRentEarlyFinish.personId);
        await dbHelper.deleteInstructions(transferRentEarlyFinish.personId);
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    intTransfer: async ({page},use,testInfo) => {
        await logService.clearLogFile();
        const intTransfer = new InstructionPage(page);
        await dbHelper.deleteFifaSending(intTransfer.personId);
        await dbHelper.deleteInstructions(intTransfer.personId);
        await intTransfer.authorization();
        await use(intTransfer);
        await dbHelper.deleteFifaSending(intTransfer.personId);
        await dbHelper.deleteInstructions(intTransfer.personId);
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    registry: async ({page},use,testInfo) => {
        await logService.clearLogFile();
        const registry = new RegistriesPage(page);
        await registry.authorization();
        await use(registry);
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    }
})

