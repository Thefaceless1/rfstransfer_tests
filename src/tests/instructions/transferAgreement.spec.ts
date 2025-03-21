import {test} from "../../helpers/fixtures";
import {InputData} from "../../helpers/InputData";
import Process from "process";
import config from "../../../playwright.config";
import {InstructionTypes} from "../../helpers/enums/InstructionTypes";
import {expect} from "@playwright/test";
import {TransferSubTypeIds} from "../../helpers/enums/transferSubTypeIds";
import {PaymentTypes} from "../../helpers/enums/PaymentTypes";
import {InstructionStates} from "../../helpers/enums/InstructionStates";
import {PaymentStates} from "../../helpers/enums/PaymentStates";
import {FifaSendingActionTypes} from "../../helpers/enums/FifaSendingActionTypes";

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
                    subType: TransferSubTypeIds.withoutBuyoutFromRent
                });
                await expect(transfer.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transfer.addContract(transfer.newContractStartDate,transfer.newContractEndDate);
                await expect(transfer.numberValueByName(transfer.employmentContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения",async () => {
                await transfer.addAdditionalAgreement(false,transfer.newContractStartDate);
                await expect(transfer.numberValueByName(transfer.additionalAgreementWithoutChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного соглашения",async () => {
                await transfer.addTransferAgreement({});
                await expect(transfer.numberValueByName(transfer.transferContractNumber)).toBeVisible();
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
                expect(await transfer.checkPrevContractsDateChanges(TransferSubTypeIds.withoutBuyoutFromRent)).toBeTruthy();
                await transfer.checkFifaSending(FifaSendingActionTypes.transferDeclaration);
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await transfer.addFactPayments(InstructionTypes.transferAgreement);
                await expect(transfer.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(transfer.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(transfer.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
                await transfer.checkFifaSending(FifaSendingActionTypes.proofOfPayment);
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
            await test.step("Формирование и загрузка на ПК печатной формы инструкции",async () => {
                const [actualReportName, expectedReportName] = await transfer.printInstructionReport();
                expect(actualReportName).toBe(expectedReportName);
            })
            await test.step("Отмена регистрации инструкции",async () => {
                await transfer.cancelRegistration();
                await transfer.checkCancelRegistrationRequirements(transfer.instructionId);
            })
        })
    test(`Выкуп из аренды (новый ТД). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({leaseBuyout}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await leaseBuyout.createInstruction({
                    type: InstructionTypes.transferAgreement,
                    subType: TransferSubTypeIds.buyoutFromRentWithNewContract
                });
                await expect(leaseBuyout.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await leaseBuyout.addContract(leaseBuyout.newContractStartDate,leaseBuyout.newContractEndDate);
                await expect(leaseBuyout.numberValueByName(leaseBuyout.employmentContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения",async () => {
                await leaseBuyout.addAdditionalAgreement(false,leaseBuyout.newContractStartDate);
                await expect(leaseBuyout.numberValueByName(leaseBuyout.additionalAgreementWithoutChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного соглашения",async () => {
                await leaseBuyout.addTransferAgreement({});
                await expect(leaseBuyout.numberValueByName(leaseBuyout.transferContractNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await leaseBuyout.addPayments(InstructionTypes.transferAgreement);
                await expect(leaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(leaseBuyout.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(leaseBuyout.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await leaseBuyout.registrationInstruction();
                await expect(leaseBuyout.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await leaseBuyout.checkPrevContractsDateChanges(TransferSubTypeIds.buyoutFromRentWithNewContract)).toBeTruthy();
                await leaseBuyout.checkFifaSending(FifaSendingActionTypes.transferDeclaration);
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await leaseBuyout.addFactPayments(InstructionTypes.transferAgreement);
                await expect(leaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(leaseBuyout.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(leaseBuyout.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
                await leaseBuyout.checkFifaSending(FifaSendingActionTypes.proofOfPayment);
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await leaseBuyout.returnPaymentToPrevState();
                await expect(leaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(leaseBuyout.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(leaseBuyout.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await leaseBuyout.cancelPayment();
                await expect(leaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
            await test.step("Формирование и загрузка на ПК печатной формы инструкции",async () => {
                const [actualReportName, expectedReportName] = await leaseBuyout.printInstructionReport();
                expect(actualReportName).toBe(expectedReportName);
            })
            await test.step("Отмена регистрации инструкции",async () => {
                await leaseBuyout.cancelRegistration();
                await leaseBuyout.checkCancelRegistrationRequirements(leaseBuyout.instructionId);
            })
        })
    test(`Выкуп из аренды (изменение ТД). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({leaseBuyout}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await leaseBuyout.createInstruction({
                    type: InstructionTypes.transferAgreement,
                    subType: TransferSubTypeIds.buyoutFromRentWithoutNewContract
                });
                await expect(leaseBuyout.instructionName).toBeVisible();
            })
            await test.step("Наличие автоматически добавленного пред. договора с новым клубом",async () => {
                await expect(leaseBuyout.numberValueByName(leaseBuyout.employmentContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения на продление",async () => {
                await leaseBuyout.addAdditionalAgreement(true,leaseBuyout.newContractStartDate);
                await expect(leaseBuyout.numberValueByName(leaseBuyout.additionalAgreementWithChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного соглашения",async () => {
                await leaseBuyout.addTransferAgreement({});
                await expect(leaseBuyout.numberValueByName(leaseBuyout.transferContractNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await leaseBuyout.addPayments(InstructionTypes.transferAgreement);
                await expect(leaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(leaseBuyout.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(leaseBuyout.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await leaseBuyout.registrationInstruction();
                await expect(leaseBuyout.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await leaseBuyout.checkPrevContractsDateChanges(TransferSubTypeIds.buyoutFromRentWithoutNewContract)).toBeTruthy();
                await leaseBuyout.checkFifaSending(FifaSendingActionTypes.transferDeclaration);
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await leaseBuyout.addFactPayments(InstructionTypes.transferAgreement);
                await expect(leaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(leaseBuyout.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(leaseBuyout.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
                await leaseBuyout.checkFifaSending(FifaSendingActionTypes.proofOfPayment);
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await leaseBuyout.returnPaymentToPrevState();
                await expect(leaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(leaseBuyout.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(leaseBuyout.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await leaseBuyout.cancelPayment();
                await expect(leaseBuyout.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
            await test.step("Формирование и загрузка на ПК печатной формы инструкции",async () => {
                const [actualReportName, expectedReportName] = await leaseBuyout.printInstructionReport();
                expect(actualReportName).toBe(expectedReportName);
            })
            await test.step("Отмена регистрации инструкции",async () => {
                await leaseBuyout.cancelRegistration();
                await leaseBuyout.checkCancelRegistrationRequirements(leaseBuyout.instructionId);
            })
        })
})