import {test} from "../helpers/fixtures";
import {InputData} from "../helpers/InputData";
import Process from "process";
import config from "../../playwright.config";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {expect} from "@playwright/test";
import {TransferAgreementSubTypes} from "../helpers/enums/TransferAgreementSubTypes";
import {PaymentTypes} from "../helpers/enums/PaymentTypes";
import {InstructionStates} from "../helpers/enums/InstructionStates";

test.describe("Инструкция с типом 'Переход на постоянной основе'",() => {
    test(`Без выкупа из аренды. Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transfer}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transfer.createInstruction({
                    type: InstructionTypes.transferAgreement,
                    subType: TransferAgreementSubTypes.withoutBuyoutFromRent
                });
                await expect(transfer.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transfer.addContract(transfer.newContractStartDate,transfer.newContractEndDate);
                await expect(transfer.numberValueByName(transfer.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения",async () => {
                await transfer.addAdditionalAgreement(false,transfer.newContractStartDate);
                await expect(transfer.numberValueByName(transfer.additionalAgreementWithoutChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного соглашения",async () => {
                await transfer.addTransferAgreement();
                await expect(transfer.numberValueByName(transfer.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transfer.addPayments();
                await expect(transfer.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transfer.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transfer.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transfer.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transfer.registrationInstruction();
                await expect(transfer.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transfer.regBeginDate).toHaveValue(transfer.newContractStartDate);
                await expect(transfer.regEndDate).toHaveValue(transfer.newContractEndDate);
                expect(await transfer.checkPrevContractsDateChanges(TransferAgreementSubTypes.withoutBuyoutFromRent)).toBeTruthy()
            })
        })
    test(`Выкуп из аренды с расторжением. Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferLeaseBuyout}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferLeaseBuyout.createInstruction({
                    type: InstructionTypes.transferAgreement,
                    subType: TransferAgreementSubTypes.buyoutFromRentWithNewContract
                });
                await expect(transferLeaseBuyout.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transferLeaseBuyout.addContract(transferLeaseBuyout.newContractStartDate,transferLeaseBuyout.newContractEndDate);
                await expect(transferLeaseBuyout.numberValueByName(transferLeaseBuyout.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения",async () => {
                await transferLeaseBuyout.addAdditionalAgreement(false,transferLeaseBuyout.newContractStartDate);
                await expect(transferLeaseBuyout.numberValueByName(transferLeaseBuyout.additionalAgreementWithoutChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного соглашения",async () => {
                await transferLeaseBuyout.addTransferAgreement();
                await expect(transferLeaseBuyout.numberValueByName(transferLeaseBuyout.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferLeaseBuyout.addPayments();
                await expect(transferLeaseBuyout.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferLeaseBuyout.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferLeaseBuyout.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferLeaseBuyout.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferLeaseBuyout.registrationInstruction();
                await expect(transferLeaseBuyout.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferLeaseBuyout.regBeginDate).toHaveValue(transferLeaseBuyout.newContractStartDate);
                await expect(transferLeaseBuyout.regEndDate).toHaveValue(transferLeaseBuyout.newContractEndDate);
                expect(await transferLeaseBuyout.checkPrevContractsDateChanges(TransferAgreementSubTypes.buyoutFromRentWithNewContract)).toBeTruthy()
            })
        })
    test(`Выкуп из аренды без расторжения. Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferLeaseBuyout}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferLeaseBuyout.createInstruction({
                    type: InstructionTypes.transferAgreement,
                    subType: TransferAgreementSubTypes.buyoutFromRentWithoutNewContract
                });
                await expect(transferLeaseBuyout.instructionName).toBeVisible();
            })
            await test.step("Наличие автоматически добавленного пред. договора с новым клубом",async () => {
                await expect(transferLeaseBuyout.numberValueByName(transferLeaseBuyout.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения на продление",async () => {
                await transferLeaseBuyout.addAdditionalAgreement(true,transferLeaseBuyout.newContractStartDate);
                await expect(transferLeaseBuyout.numberValueByName(transferLeaseBuyout.additionalAgreementWithChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного соглашения",async () => {
                await transferLeaseBuyout.addTransferAgreement();
                await expect(transferLeaseBuyout.numberValueByName(transferLeaseBuyout.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferLeaseBuyout.addPayments();
                await expect(transferLeaseBuyout.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferLeaseBuyout.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferLeaseBuyout.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferLeaseBuyout.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferLeaseBuyout.registrationInstruction();
                await expect(transferLeaseBuyout.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferLeaseBuyout.regBeginDate).toHaveValue(transferLeaseBuyout.prevContractNewClubStartDate);
                await expect(transferLeaseBuyout.regEndDate).toHaveValue(transferLeaseBuyout.additionalAgreementDateEndByDs);
                expect(await transferLeaseBuyout.checkPrevContractsDateChanges(TransferAgreementSubTypes.buyoutFromRentWithoutNewContract)).toBeTruthy()
            })
        })
})