import {test as base} from '@playwright/test';
import {InstructionPage} from "../pages/InstructionPage";
import {dbHelper} from "../db/DbService";
import {TransferRentSubTypeIds} from "./enums/transferRentSubTypeIds";
import {logService} from "../logger/LogService";
import {RegistriesPage} from "../pages/RegistriesPage";
import {InstructionTypeIds} from "./enums/InstructionTypeIds";

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
        await additionalAgreement.registerPreliminaryInstruction({typeId: InstructionTypeIds.newEmploymentContract});
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
        await transfer.registerPreliminaryInstruction({typeId: InstructionTypeIds.newEmploymentContract});
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
        await leaseBuyout.registerPreliminaryInstruction({typeId: InstructionTypeIds.newEmploymentContract});
        await leaseBuyout.registerPreliminaryInstruction({
            typeId: InstructionTypeIds.transferAgreementOnRentTerms,
            subTypeId: TransferRentSubTypeIds.toRent
        });
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
        await transferRent.registerPreliminaryInstruction({typeId: InstructionTypeIds.newEmploymentContract});
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
        await rentProlongation.registerPreliminaryInstruction({typeId: InstructionTypeIds.newEmploymentContract});
        await rentProlongation.registerPreliminaryInstruction({
            typeId: InstructionTypeIds.transferAgreementOnRentTerms,
            subTypeId: TransferRentSubTypeIds.toRent
        });
        await use(rentProlongation);
        await dbHelper.deleteFifaSending(rentProlongation.personId);
        await dbHelper.deleteInstructions(rentProlongation.personId);
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    earlyFinishRent: async ({page},use,testInfo)=> {
        await logService.clearLogFile();
        const transferRentEarlyFinish = new InstructionPage(page);
        const isEarlyFinishWithNewContract: boolean = testInfo.title.includes("новый ТД");
        await dbHelper.deleteFifaSending(transferRentEarlyFinish.personId);
        await dbHelper.deleteInstructions(transferRentEarlyFinish.personId);
        await transferRentEarlyFinish.authorization();
        await transferRentEarlyFinish.registerPreliminaryInstruction({
            typeId: InstructionTypeIds.newEmploymentContract,
            isForEarlyFinish: true
        });
        await transferRentEarlyFinish.registerPreliminaryInstruction({
            typeId: InstructionTypeIds.transferAgreementOnRentTerms,
            subTypeId: TransferRentSubTypeIds.toRent,
            isForEarlyFinish: true,
            isEarlyFinishWithNewContract: isEarlyFinishWithNewContract
        });
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

