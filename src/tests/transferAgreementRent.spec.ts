import {test} from "../helpers/fixtures";
import {InputData} from "../helpers/InputData";
import Process from "process";
import config from "../../playwright.config";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {expect} from "@playwright/test";
import {TransferAgreementRentSubTypes} from "../helpers/enums/TransferAgreementRentSubTypes";
import {TransferContractType} from "../helpers/enums/TransferContractType";
import {PaymentTypes} from "../helpers/enums/PaymentTypes";
import {InstructionStateIds} from "../helpers/enums/InstructionStateIds";
import {InstructionStates} from "../helpers/enums/InstructionStates";
test.describe("Инструкция с типом 'Переход на временной основе (аренда)'",() => {
    test(`Взять в аренду(ТК с разрывом). Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferAgreementRent}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferAgreementRent.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferAgreementRentSubTypes.toRent
                });
                await expect(transferAgreementRent.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transferAgreementRent.addContract(transferAgreementRent.newContractStartDate,transferAgreementRent.newContractEndDate);
                await expect(transferAgreementRent.numberValueByName(transferAgreementRent.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление трансферного контракта",async () => {
                await transferAgreementRent.addTransferAgreement(TransferAgreementRentSubTypes.toRent,TransferContractType.withTermination);
                await expect(transferAgreementRent.numberValueByName(transferAgreementRent.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferAgreementRent.addPayments();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Отправка инструкции на регистрацию",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.onRegistration);
                await expect(transferAgreementRent.instructionState(InstructionStates.onRegistration)).toBeVisible();
                await expect(transferAgreementRent.regBeginDate).toHaveValue(transferAgreementRent.newContractStartDate);
                await expect(transferAgreementRent.regEndDate).toHaveValue(transferAgreementRent.newContractEndDate);
            })
            await test.step("Назначение себя ответственным на инструкцию",async () => {
                await transferAgreementRent.nominationYourselfForInstruction();
                expect(await transferAgreementRent.currentUser.innerText()).toBe(await transferAgreementRent.nominatedUser.innerText());
            })
            await test.step("Отправка инструкции на доработку",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.onCorrection);
                await expect(transferAgreementRent.instructionState(InstructionStates.onCorrection)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.registered);
                await expect(transferAgreementRent.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await transferAgreementRent.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.toRent,TransferContractType.withTermination)).toBeTruthy()
            })
        })
    test(`Взять в аренду(ТК с приостановкой). Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferAgreementRent}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferAgreementRent.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferAgreementRentSubTypes.toRent
                });
                await expect(transferAgreementRent.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transferAgreementRent.addContract(transferAgreementRent.newContractStartDate,transferAgreementRent.newContractEndDate);
                await expect(transferAgreementRent.numberValueByName(transferAgreementRent.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление трансферного контракта",async () => {
                await transferAgreementRent.addTransferAgreement(TransferAgreementRentSubTypes.toRent,TransferContractType.withSuspension);
                await expect(transferAgreementRent.numberValueByName(transferAgreementRent.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferAgreementRent.addPayments();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Отправка инструкции на регистрацию",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.onRegistration);
                await expect(transferAgreementRent.instructionState(InstructionStates.onRegistration)).toBeVisible();
                await expect(transferAgreementRent.regBeginDate).toHaveValue(transferAgreementRent.newContractStartDate);
                await expect(transferAgreementRent.regEndDate).toHaveValue(transferAgreementRent.newContractEndDate);
            })
            await test.step("Назначение себя ответственным на инструкцию",async () => {
                await transferAgreementRent.nominationYourselfForInstruction();
                expect(await transferAgreementRent.currentUser.innerText()).toBe(await transferAgreementRent.nominatedUser.innerText());
            })
            await test.step("Отправка инструкции на доработку",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.onCorrection);
                await expect(transferAgreementRent.instructionState(InstructionStates.onCorrection)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.registered);
                await expect(transferAgreementRent.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await transferAgreementRent.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.toRent,TransferContractType.withSuspension)).toBeTruthy()
            })
        })
    test(`Продление аренды(новый ТД, новый ТК). Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferAgreementRent}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferAgreementRent.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferAgreementRentSubTypes.prolongationNewContractNewTransfer
                });
                await expect(transferAgreementRent.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transferAgreementRent.addContract(transferAgreementRent.newContractStartDate,transferAgreementRent.newContractEndDate);
                await expect(transferAgreementRent.numberValueByName(transferAgreementRent.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление трансферного контракта",async () => {
                await transferAgreementRent.addTransferAgreement(TransferAgreementRentSubTypes.prolongationNewContractNewTransfer,TransferContractType.withSuspension);
                await expect(transferAgreementRent.numberValueByName(transferAgreementRent.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferAgreementRent.addPayments();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Отправка инструкции на регистрацию",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.onRegistration);
                await expect(transferAgreementRent.instructionState(InstructionStates.onRegistration)).toBeVisible();
                await expect(transferAgreementRent.regBeginDate).toHaveValue(transferAgreementRent.newContractStartDate);
                await expect(transferAgreementRent.regEndDate).toHaveValue(transferAgreementRent.newContractEndDate);
            })
            await test.step("Назначение себя ответственным на инструкцию",async () => {
                await transferAgreementRent.nominationYourselfForInstruction();
                expect(await transferAgreementRent.currentUser.innerText()).toBe(await transferAgreementRent.nominatedUser.innerText());
            })
            await test.step("Отправка инструкции на доработку",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.onCorrection);
                await expect(transferAgreementRent.instructionState(InstructionStates.onCorrection)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.registered);
                await expect(transferAgreementRent.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await transferAgreementRent.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.prolongationNewContractNewTransfer,TransferContractType.withSuspension)).toBeTruthy()
            })
        })
    test(`Продление аренды(новый ТД, продление ТК). Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferAgreementRent}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание тестового ТК аренды",async ()=> {
                await transferAgreementRent.addTestInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferAgreementRentSubTypes.toRent
                });
            })
            await test.step("Создание инструкции", async () => {
                await transferAgreementRent.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferAgreementRentSubTypes.prolongationNewContract
                });
                await expect(transferAgreementRent.instructionName).toBeVisible();
            })
            await test.step("Наличие автоматически добавленного ТК",async () => {
                await expect(transferAgreementRent.numberValueByName(transferAgreementRent.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transferAgreementRent.addContract(transferAgreementRent.newContractStartDate,transferAgreementRent.newContractEndDate);
                await expect(transferAgreementRent.numberValueByName(transferAgreementRent.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление ДС к ТК",async () => {
                await transferAgreementRent.addAdditionalAgreementForTk();
                await expect(transferAgreementRent.numberValueByName(transferAgreementRent.additionalAgreementForTk)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferAgreementRent.addPayments();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Отправка инструкции на регистрацию",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.onRegistration);
                await expect(transferAgreementRent.instructionState(InstructionStates.onRegistration)).toBeVisible();
                await expect(transferAgreementRent.regBeginDate).toHaveValue(transferAgreementRent.newContractStartDate);
                await expect(transferAgreementRent.regEndDate).toHaveValue(transferAgreementRent.newContractEndDate);
            })
            await test.step("Назначение себя ответственным на инструкцию",async () => {
                await transferAgreementRent.nominationYourselfForInstruction();
                expect(await transferAgreementRent.currentUser.innerText()).toBe(await transferAgreementRent.nominatedUser.innerText());
            })
            await test.step("Отправка инструкции на доработку",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.onCorrection);
                await expect(transferAgreementRent.instructionState(InstructionStates.onCorrection)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.registered);
                await expect(transferAgreementRent.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await transferAgreementRent.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.prolongationNewContract,TransferContractType.withSuspension)).toBeTruthy()
            })
        })
})
