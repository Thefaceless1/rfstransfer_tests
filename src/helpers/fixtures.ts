import {test as base} from '@playwright/test';
import {InstructionPage} from "../pages/InstructionPage";
import {TransferRentSubTypeIds} from "./enums/transferRentSubTypeIds";
import {logService} from "../logger/LogService";
import {RegistriesPage} from "../pages/RegistriesPage";
import {InstructionTypeIds} from "./enums/InstructionTypeIds";
import {WorkActivityPage} from "../pages/WorkActivityPage";

type Fixtures = {
    employmentContract: InstructionPage,
    additionalAgreement: InstructionPage,
    transfer: InstructionPage,
    leaseBuyout: InstructionPage,
    transferRent: InstructionPage,
    rentProlongation: InstructionPage,
    earlyFinishRent: InstructionPage,
    intTransfer: InstructionPage,
    registry: RegistriesPage,
    workActivity: WorkActivityPage
}

export const test = base.extend<Fixtures>({
    employmentContract: async ({page},use,testInfo) => {
        await logService.clearLogFile();
        const employmentContract = new InstructionPage(page);
        await employmentContract.deleteTestUserData();
        await employmentContract.authorization();
        await use(employmentContract);
        await employmentContract.deleteTestUserData();
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    additionalAgreement: async ({page},use,testInfo) => {
        await logService.clearLogFile();
        const additionalAgreement = new InstructionPage(page);
        await additionalAgreement.deleteTestUserData();
        await additionalAgreement.authorization();
        await additionalAgreement.registerPreliminaryInstruction({typeId: InstructionTypeIds.newEmploymentContract});
        await use(additionalAgreement);
        await additionalAgreement.deleteTestUserData();
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    transfer: async ({page},use,testInfo) => {
        await logService.clearLogFile();
        const transfer = new InstructionPage(page);
        await transfer.deleteTestUserData();
        await transfer.authorization();
        await transfer.registerPreliminaryInstruction({typeId: InstructionTypeIds.newEmploymentContract});
        await use(transfer);
        await transfer.deleteTestUserData();
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    leaseBuyout: async ({page},use,testInfo) => {
        await logService.clearLogFile();
        const leaseBuyout = new InstructionPage(page);
        await leaseBuyout.deleteTestUserData();
        await leaseBuyout.authorization();
        await leaseBuyout.registerPreliminaryInstruction({typeId: InstructionTypeIds.newEmploymentContract});
        await leaseBuyout.registerPreliminaryInstruction({
            typeId: InstructionTypeIds.transferAgreementOnRentTerms,
            subTypeId: TransferRentSubTypeIds.toRent
        });
        await use(leaseBuyout);
        await leaseBuyout.deleteTestUserData();
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    transferRent: async ({page},use,testInfo) => {
        await logService.clearLogFile();
        const transferRent = new InstructionPage(page);
        await transferRent.deleteTestUserData();
        await transferRent.authorization();
        await transferRent.registerPreliminaryInstruction({typeId: InstructionTypeIds.newEmploymentContract});
        await use(transferRent);
        await transferRent.deleteTestUserData();
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    rentProlongation: async ({page},use,testInfo)=> {
        await logService.clearLogFile();
        const rentProlongation = new InstructionPage(page);
        await rentProlongation.deleteTestUserData();
        await rentProlongation.authorization();
        await rentProlongation.registerPreliminaryInstruction({typeId: InstructionTypeIds.newEmploymentContract});
        await rentProlongation.registerPreliminaryInstruction({
            typeId: InstructionTypeIds.transferAgreementOnRentTerms,
            subTypeId: TransferRentSubTypeIds.toRent
        });
        await use(rentProlongation);
        await rentProlongation.deleteTestUserData();
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    earlyFinishRent: async ({page},use,testInfo)=> {
        await logService.clearLogFile();
        const transferRentEarlyFinish = new InstructionPage(page);
        const isEarlyFinishWithNewContract: boolean = Boolean(testInfo.tags.find(tag => tag == '@earlyFinishWithNewContract'));
        await transferRentEarlyFinish.deleteTestUserData();
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
        await transferRentEarlyFinish.deleteTestUserData();
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    intTransfer: async ({page},use,testInfo) => {
        await logService.clearLogFile();
        const intTransfer = new InstructionPage(page);
        await intTransfer.deleteTestUserData();
        await intTransfer.authorization();
        await use(intTransfer);
        await intTransfer.deleteTestUserData();
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    registry: async ({page},use,testInfo) => {
        await logService.clearLogFile();
        const registry = new RegistriesPage(page);
        const isEmployeeRegistry: boolean = Boolean(testInfo.tags.find(tag => tag == '@employeeRegistry'));
        await registry.deleteTestUserData();
        await registry.authorization();
        if (isEmployeeRegistry) await registry.registerPreliminaryWorkActivity();
        await use(registry);
        await registry.deleteTestUserData();
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    },
    workActivity: async ({page},use,testInfo) => {
        await logService.clearLogFile();
        const workActivity = new WorkActivityPage(page);
        await workActivity.deleteTestUserData();
        await workActivity.authorization();
        await use(workActivity);
        await workActivity.deleteTestUserData();
        await testInfo.attach('Log File', {path: logService.logsFilePath});
    }
})

