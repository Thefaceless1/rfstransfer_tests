import {test} from "../helpers/fixtures";
import {InputData} from "../helpers/InputData";
import Process from "process";
import config from "../../playwright.config";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {expect} from "@playwright/test";
import {TransferAgreementSubTypes} from "../helpers/enums/TransferAgreementSubTypes";
import {PaymentTypes} from "../helpers/enums/PaymentTypes";
import {InstructionStateIds} from "../helpers/enums/InstructionStateIds";
import {InstructionStates} from "../helpers/enums/InstructionStates";

test.describe("Инструкция с типом 'Переход на постоянной основе'",() => {
    test(`Без выкупа из аренды. Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferAgreement}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferAgreement.createInstruction({
                    type: InstructionTypes.transferAgreement,
                    subType: TransferAgreementSubTypes.withoutBuyoutFromRent
                });
                await expect(transferAgreement.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transferAgreement.addContract(transferAgreement.newContractStartDate,transferAgreement.newContractEndDate);
                await expect(transferAgreement.numberValueByName(transferAgreement.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения",async () => {
                await transferAgreement.addAdditionalAgreement(false,transferAgreement.newContractStartDate);
                await expect(transferAgreement.numberValueByName(transferAgreement.additionalAgreementWithoutChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного соглашения",async () => {
                await transferAgreement.addTransferAgreement(TransferAgreementSubTypes.withoutBuyoutFromRent);
                await expect(transferAgreement.numberValueByName(transferAgreement.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferAgreement.addPayments();
                await expect(transferAgreement.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferAgreement.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferAgreement.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferAgreement.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Отправка инструкции на регистрацию",async () => {
                await transferAgreement.updateInstructionState(InstructionStateIds.onRegistration);
                await expect(transferAgreement.instructionState(InstructionStates.onRegistration)).toBeVisible();
                await expect(transferAgreement.regBeginDate).toHaveValue(transferAgreement.newContractStartDate);
                await expect(transferAgreement.regEndDate).toHaveValue(transferAgreement.newContractEndDate);
            })
            await test.step("Назначение себя ответственным на инструкцию",async () => {
                await transferAgreement.nominationYourselfForInstruction();
                expect(await transferAgreement.currentUser.innerText()).toBe(await transferAgreement.nominatedUser.innerText());
            })
            await test.step("Отправка инструкции на доработку",async () => {
                await transferAgreement.updateInstructionState(InstructionStateIds.onCorrection);
                await expect(transferAgreement.instructionState(InstructionStates.onCorrection)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferAgreement.updateInstructionState(InstructionStateIds.registered);
                await expect(transferAgreement.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await transferAgreement.checkPrevContractsDateChanges(TransferAgreementSubTypes.withoutBuyoutFromRent)).toBeTruthy()
            })
        })
    test(`Выкуп из аренды с расторжением. Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferAgreement}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferAgreement.createInstruction({
                    type: InstructionTypes.transferAgreement,
                    subType: TransferAgreementSubTypes.buyoutFromRentWithNewContract
                });
                await expect(transferAgreement.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transferAgreement.addContract(transferAgreement.newContractStartDate,transferAgreement.newContractEndDate);
                await expect(transferAgreement.numberValueByName(transferAgreement.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения",async () => {
                await transferAgreement.addAdditionalAgreement(false,transferAgreement.newContractStartDate);
                await expect(transferAgreement.numberValueByName(transferAgreement.additionalAgreementWithoutChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного соглашения",async () => {
                await transferAgreement.addTransferAgreement(TransferAgreementSubTypes.buyoutFromRentWithNewContract);
                await expect(transferAgreement.numberValueByName(transferAgreement.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferAgreement.addPayments();
                await expect(transferAgreement.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferAgreement.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferAgreement.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferAgreement.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Отправка инструкции на регистрацию",async () => {
                await transferAgreement.updateInstructionState(InstructionStateIds.onRegistration);
                await expect(transferAgreement.instructionState(InstructionStates.onRegistration)).toBeVisible();
                await expect(transferAgreement.regBeginDate).toHaveValue(transferAgreement.newContractStartDate);
                await expect(transferAgreement.regEndDate).toHaveValue(transferAgreement.newContractEndDate);
            })
            await test.step("Назначение себя ответственным на инструкцию",async () => {
                await transferAgreement.nominationYourselfForInstruction();
                expect(await transferAgreement.currentUser.innerText()).toBe(await transferAgreement.nominatedUser.innerText());
            })
            await test.step("Отправка инструкции на доработку",async () => {
                await transferAgreement.updateInstructionState(InstructionStateIds.onCorrection);
                await expect(transferAgreement.instructionState(InstructionStates.onCorrection)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferAgreement.updateInstructionState(InstructionStateIds.registered);
                await expect(transferAgreement.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await transferAgreement.checkPrevContractsDateChanges(TransferAgreementSubTypes.buyoutFromRentWithNewContract)).toBeTruthy()
            })
        })
    test(`Выкуп из аренды без расторжения. Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferAgreement}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferAgreement.createInstruction({
                    type: InstructionTypes.transferAgreement,
                    subType: TransferAgreementSubTypes.buyoutFromRentWithoutNewContract
                });
                await expect(transferAgreement.instructionName).toBeVisible();
            })
            await test.step("Наличие автоматически добавленного пред. договора с новым клубом",async () => {
                await expect(transferAgreement.numberValueByName(transferAgreement.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения на продление",async () => {
                await transferAgreement.addAdditionalAgreement(true,transferAgreement.newContractStartDate);
                await expect(transferAgreement.numberValueByName(transferAgreement.additionalAgreementWithChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного соглашения",async () => {
                await transferAgreement.addTransferAgreement(TransferAgreementSubTypes.buyoutFromRentWithoutNewContract);
                await expect(transferAgreement.numberValueByName(transferAgreement.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferAgreement.addPayments();
                await expect(transferAgreement.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferAgreement.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferAgreement.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferAgreement.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Отправка инструкции на регистрацию",async () => {
                await transferAgreement.updateInstructionState(InstructionStateIds.onRegistration);
                await expect(transferAgreement.instructionState(InstructionStates.onRegistration)).toBeVisible();
                await expect(transferAgreement.regBeginDate).toHaveValue(transferAgreement.prevContractNewClubStartDate);
                await expect(transferAgreement.regEndDate).toHaveValue(transferAgreement.additionalAgreementDateEndByDs);
            })
            await test.step("Назначение себя ответственным на инструкцию",async () => {
                await transferAgreement.nominationYourselfForInstruction();
                expect(await transferAgreement.currentUser.innerText()).toBe(await transferAgreement.nominatedUser.innerText());
            })
            await test.step("Отправка инструкции на доработку",async () => {
                await transferAgreement.updateInstructionState(InstructionStateIds.onCorrection);
                await expect(transferAgreement.instructionState(InstructionStates.onCorrection)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferAgreement.updateInstructionState(InstructionStateIds.registered);
                await expect(transferAgreement.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await transferAgreement.checkPrevContractsDateChanges(TransferAgreementSubTypes.buyoutFromRentWithoutNewContract)).toBeTruthy()
            })
        })
})