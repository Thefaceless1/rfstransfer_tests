import {test} from "../helpers/fixtures";
import {InputData} from "../helpers/InputData";
import Process from "process";
import config from "../../playwright.config";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {expect} from "@playwright/test";
import {TransferAgreementSubTypes} from "../helpers/enums/TransferAgreementSubTypes";
import {PaymentTypes} from "../helpers/enums/PaymentTypes";
import {InstructionStates} from "../helpers/enums/InstructionStates";
import {PaymentStates} from "../helpers/enums/PaymentStates";

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
                await transfer.addTransferAgreement({});
                await expect(transfer.numberValueByName(transfer.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transfer.addPayments(InstructionTypes.transferAgreement);
                await expect(transfer.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transfer.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transfer.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transfer.registrationInstruction();
                await expect(transfer.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transfer.regBeginDate).toHaveValue(transfer.newContractStartDate);
                await expect(transfer.regEndDate).toHaveValue(transfer.newContractEndDate);
                expect(await transfer.checkPrevContractsDateChanges(TransferAgreementSubTypes.withoutBuyoutFromRent)).toBeTruthy()
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await transfer.addFactPayments(InstructionTypes.transferAgreement);
                await expect(transfer.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(transfer.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(transfer.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await transfer.returnPaymentToPrevState();
                await expect(transfer.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transfer.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transfer.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await transfer.cancelPayment();
                await expect(transfer.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
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
                await transferLeaseBuyout.addTransferAgreement({});
                await expect(transferLeaseBuyout.numberValueByName(transferLeaseBuyout.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferLeaseBuyout.addPayments(InstructionTypes.transferAgreement);
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferLeaseBuyout.registrationInstruction();
                await expect(transferLeaseBuyout.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferLeaseBuyout.regBeginDate).toHaveValue(transferLeaseBuyout.newContractStartDate);
                await expect(transferLeaseBuyout.regEndDate).toHaveValue(transferLeaseBuyout.newContractEndDate);
                expect(await transferLeaseBuyout.checkPrevContractsDateChanges(TransferAgreementSubTypes.buyoutFromRentWithNewContract)).toBeTruthy()
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await transferLeaseBuyout.addFactPayments(InstructionTypes.transferAgreement);
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await transferLeaseBuyout.returnPaymentToPrevState();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await transferLeaseBuyout.cancelPayment();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
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
                await transferLeaseBuyout.addTransferAgreement({});
                await expect(transferLeaseBuyout.numberValueByName(transferLeaseBuyout.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferLeaseBuyout.addPayments(InstructionTypes.transferAgreement);
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferLeaseBuyout.registrationInstruction();
                await expect(transferLeaseBuyout.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferLeaseBuyout.regBeginDate).toHaveValue(transferLeaseBuyout.prevContractNewClubStartDate);
                await expect(transferLeaseBuyout.regEndDate).toHaveValue(transferLeaseBuyout.additionalAgreementDateEndByDs);
                expect(await transferLeaseBuyout.checkPrevContractsDateChanges(TransferAgreementSubTypes.buyoutFromRentWithoutNewContract)).toBeTruthy()
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await transferLeaseBuyout.addFactPayments(InstructionTypes.transferAgreement);
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await transferLeaseBuyout.returnPaymentToPrevState();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await transferLeaseBuyout.cancelPayment();
                await expect(transferLeaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
        })
})