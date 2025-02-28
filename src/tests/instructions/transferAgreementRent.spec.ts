import {test} from "../../helpers/fixtures";
import {InputData} from "../../helpers/InputData";
import Process from "process";
import config from "../../../playwright.config";
import {InstructionTypes} from "../../helpers/enums/InstructionTypes";
import {expect} from "@playwright/test";
import {TransferRentSubTypeIds} from "../../helpers/enums/transferRentSubTypeIds";
import {TransferContractTypeIds} from "../../helpers/enums/TransferContractTypeIds";
import {PaymentTypes} from "../../helpers/enums/PaymentTypes";
import {InstructionStates} from "../../helpers/enums/InstructionStates";
import {PaymentStates} from "../../helpers/enums/PaymentStates";
import {FifaSendingActionTypes} from "../../helpers/enums/FifaSendingActionTypes";

test.describe("Инструкция с типом 'Переход на временной основе (аренда)'",() => {
    test(`Взять в аренду(ТК с разрывом). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferRent}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferRent.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferRentSubTypeIds.toRent
                });
                await expect(transferRent.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transferRent.addContract(transferRent.newContractStartDate,transferRent.newContractEndDate);
                await expect(transferRent.numberValueByName(transferRent.employmentContractNumber)).toBeVisible();
            })
            await test.step("Добавление трансферного контракта",async () => {
                await transferRent.addTransferAgreement({transferContractType: TransferContractTypeIds.withTermination});
                await expect(transferRent.numberValueByName(transferRent.transferContractNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferRent.addPayments(InstructionTypes.transferAgreementOnRentTerms);
                await expect(transferRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRent.registrationInstruction();
                await expect(transferRent.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await transferRent.checkPrevContractsDateChanges(TransferRentSubTypeIds.toRent,TransferContractTypeIds.withTermination)).toBeTruthy();
                await transferRent.checkFifaSending(FifaSendingActionTypes.transferDeclaration);
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await transferRent.addFactPayments(InstructionTypes.transferAgreement);
                await expect(transferRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
                await transferRent.checkFifaSending(FifaSendingActionTypes.proofOfPayment);
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await transferRent.returnPaymentToPrevState();
                await expect(transferRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await transferRent.cancelPayment();
                await expect(transferRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
            await test.step("Формирование и загрузка на ПК печатной формы инструкции",async () => {
                const [actualReportName, expectedReportName] = await transferRent.printInstructionReport();
                expect(actualReportName).toBe(expectedReportName);
            })
            await test.step("Отмена регистрации инструкции",async () => {
                await transferRent.cancelRegistration();
                await transferRent.checkCancelRegistrationRequirements(transferRent.instructionId);
            })
        })
    test(`Взять в аренду(ТК с приостановкой). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferRent}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferRent.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferRentSubTypeIds.toRent
                });
                await expect(transferRent.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transferRent.addContract(transferRent.newContractStartDate,transferRent.newContractEndDate);
                await expect(transferRent.numberValueByName(transferRent.employmentContractNumber)).toBeVisible();
            })
            await test.step("Добавление трансферного контракта",async () => {
                await transferRent.addTransferAgreement({transferContractType: TransferContractTypeIds.withSuspension});
                await expect(transferRent.numberValueByName(transferRent.transferContractNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferRent.addPayments(InstructionTypes.transferAgreementOnRentTerms);
                await expect(transferRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRent.registrationInstruction();
                await expect(transferRent.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await transferRent.checkPrevContractsDateChanges(TransferRentSubTypeIds.toRent,TransferContractTypeIds.withSuspension)).toBeTruthy();
                await transferRent.checkFifaSending(FifaSendingActionTypes.transferDeclaration);
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await transferRent.addFactPayments(InstructionTypes.transferAgreement);
                await expect(transferRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
                await transferRent.checkFifaSending(FifaSendingActionTypes.proofOfPayment);
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await transferRent.returnPaymentToPrevState();
                await expect(transferRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await transferRent.cancelPayment();
                await expect(transferRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
            await test.step("Формирование и загрузка на ПК печатной формы инструкции",async () => {
                const [actualReportName, expectedReportName] = await transferRent.printInstructionReport();
                expect(actualReportName).toBe(expectedReportName);
            })
            await test.step("Отмена регистрации инструкции",async () => {
                await transferRent.cancelRegistration();
                await transferRent.checkCancelRegistrationRequirements(transferRent.instructionId);
            })
        })
    test(`Продление аренды(новый ТД, новый ТК). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({rentProlongation}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await rentProlongation.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferRentSubTypeIds.prolongationNewContractNewTransfer
                });
                await expect(rentProlongation.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await rentProlongation.addContract(rentProlongation.newContractStartDate,rentProlongation.newContractEndDate);
                await expect(rentProlongation.numberValueByName(rentProlongation.employmentContractNumber)).toBeVisible();
            })
            await test.step("Добавление трансферного контракта",async () => {
                await rentProlongation.addTransferAgreement({transferContractType: TransferContractTypeIds.withSuspension});
                await expect(rentProlongation.numberValueByName(rentProlongation.transferContractNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await rentProlongation.addPayments(InstructionTypes.transferAgreementOnRentTerms);
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await rentProlongation.registrationInstruction();
                await expect(rentProlongation.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await rentProlongation.checkPrevContractsDateChanges(TransferRentSubTypeIds.prolongationNewContractNewTransfer,TransferContractTypeIds.withSuspension)).toBeTruthy();
                await rentProlongation.checkFifaSending(FifaSendingActionTypes.transferDeclaration);
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await rentProlongation.addFactPayments(InstructionTypes.transferAgreement);
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
                await rentProlongation.checkFifaSending(FifaSendingActionTypes.proofOfPayment);
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await rentProlongation.returnPaymentToPrevState();
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await rentProlongation.cancelPayment();
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
            await test.step("Формирование и загрузка на ПК печатной формы инструкции",async () => {
                const [actualReportName, expectedReportName] = await rentProlongation.printInstructionReport();
                expect(actualReportName).toBe(expectedReportName);
            })
            await test.step("Отмена регистрации инструкции",async () => {
                await rentProlongation.cancelRegistration();
                await rentProlongation.checkCancelRegistrationRequirements(rentProlongation.instructionId);
            })
        })
    test(`Продление аренды(новый ТД, ДС к ТК). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({rentProlongation}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await rentProlongation.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferRentSubTypeIds.prolongationNewContract
                });
                await expect(rentProlongation.instructionName).toBeVisible();
            })
            await test.step("Наличие автоматически добавленного ТК",async () => {
                await expect(rentProlongation.numberValueByName(rentProlongation.transferContractNumber)).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await rentProlongation.addContract(rentProlongation.newContractStartDate,rentProlongation.newContractEndDate);
                await expect(rentProlongation.numberValueByName(rentProlongation.employmentContractNumber)).toBeVisible();
            })
            await test.step("Добавление ДС к ТК",async () => {
                await rentProlongation.addAdditionalAgreementForTk();
                await expect(rentProlongation.numberValueByName(rentProlongation.additionalAgreementForTk)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await rentProlongation.addPayments(InstructionTypes.transferAgreementOnRentTerms);
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await rentProlongation.registrationInstruction();
                await expect(rentProlongation.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await rentProlongation.checkPrevContractsDateChanges(TransferRentSubTypeIds.prolongationNewContract,TransferContractTypeIds.withSuspension)).toBeTruthy();
                await rentProlongation.checkFifaSending(FifaSendingActionTypes.transferDeclaration);
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await rentProlongation.addFactPayments(InstructionTypes.transferAgreement);
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
                await rentProlongation.checkFifaSending(FifaSendingActionTypes.proofOfPayment);
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await rentProlongation.returnPaymentToPrevState();
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await rentProlongation.cancelPayment();
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
            await test.step("Формирование и загрузка на ПК печатной формы инструкции",async () => {
                const [actualReportName, expectedReportName] = await rentProlongation.printInstructionReport();
                expect(actualReportName).toBe(expectedReportName);
            })
            await test.step("Отмена регистрации инструкции",async () => {
                await rentProlongation.cancelRegistration();
                await rentProlongation.checkCancelRegistrationRequirements(rentProlongation.instructionId);
            })
        })
    test(`Продление аренды(ДС к ТД, новый ТК). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({rentProlongation}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await rentProlongation.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferRentSubTypeIds.prolongationNewTransfer
                });
                await expect(rentProlongation.instructionName).toBeVisible();
            })
            await test.step("Наличие автоматически добавленного пред. договора с новым клубом",async () => {
                await expect(rentProlongation.numberValueByName(rentProlongation.employmentContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения на продление",async () => {
                await rentProlongation.addAdditionalAgreement(true,rentProlongation.newContractStartDate);
                await expect(rentProlongation.numberValueByName(rentProlongation.additionalAgreementWithChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного контракта",async () => {
                await rentProlongation.addTransferAgreement({transferContractType: TransferContractTypeIds.withSuspension});
                await expect(rentProlongation.numberValueByName(rentProlongation.transferContractNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await rentProlongation.addPayments(InstructionTypes.transferAgreementOnRentTerms);
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await rentProlongation.registrationInstruction();
                await expect(rentProlongation.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await rentProlongation.checkPrevContractsDateChanges(TransferRentSubTypeIds.prolongationNewTransfer,TransferContractTypeIds.withSuspension)).toBeTruthy();
                await rentProlongation.checkFifaSending(FifaSendingActionTypes.transferDeclaration);
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await rentProlongation.addFactPayments(InstructionTypes.transferAgreement);
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
                await rentProlongation.checkFifaSending(FifaSendingActionTypes.proofOfPayment);
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await rentProlongation.returnPaymentToPrevState();
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await rentProlongation.cancelPayment();
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
            await test.step("Формирование и загрузка на ПК печатной формы инструкции",async () => {
                const [actualReportName, expectedReportName] = await rentProlongation.printInstructionReport();
                expect(actualReportName).toBe(expectedReportName);
            })
            await test.step("Отмена регистрации инструкции",async () => {
                await rentProlongation.cancelRegistration();
                await rentProlongation.checkCancelRegistrationRequirements(rentProlongation.instructionId);
            })
        })
    test(`Продление аренды(ДС к ТД, ДС к ТК). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({rentProlongation}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await rentProlongation.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferRentSubTypeIds.prolongationWithoutNewContracts
                });
                await expect(rentProlongation.instructionName).toBeVisible();
            })
            await test.step("Наличие автоматически добавленного пред. договора с новым клубом",async () => {
                await expect(rentProlongation.numberValueByName(rentProlongation.employmentContractNumber)).toBeVisible();
            })
            await test.step("Наличие автоматически добавленного ТК",async () => {
                await expect(rentProlongation.numberValueByName(rentProlongation.transferContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения на продление",async () => {
                await rentProlongation.addAdditionalAgreement(true,rentProlongation.newContractStartDate);
                await expect(rentProlongation.numberValueByName(rentProlongation.additionalAgreementWithChangeDate)).toBeVisible();
            })
            await test.step("Добавление ДС к ТК",async () => {
                await rentProlongation.addAdditionalAgreementForTk();
                await expect(rentProlongation.numberValueByName(rentProlongation.additionalAgreementForTk)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await rentProlongation.addPayments(InstructionTypes.transferAgreementOnRentTerms);
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await rentProlongation.registrationInstruction();
                await expect(rentProlongation.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await rentProlongation.checkPrevContractsDateChanges(TransferRentSubTypeIds.prolongationWithoutNewContracts,TransferContractTypeIds.withSuspension)).toBeTruthy();
                await rentProlongation.checkFifaSending(FifaSendingActionTypes.transferDeclaration);
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await rentProlongation.addFactPayments(InstructionTypes.transferAgreement);
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
                await rentProlongation.checkFifaSending(FifaSendingActionTypes.proofOfPayment);
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await rentProlongation.returnPaymentToPrevState();
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(rentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await rentProlongation.cancelPayment();
                await expect(rentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
            await test.step("Формирование и загрузка на ПК печатной формы инструкции",async () => {
                const [actualReportName, expectedReportName] = await rentProlongation.printInstructionReport();
                expect(actualReportName).toBe(expectedReportName);
            })
            await test.step("Отмена регистрации инструкции",async () => {
                await rentProlongation.cancelRegistration();
                await rentProlongation.checkCancelRegistrationRequirements(rentProlongation.instructionId);
            })
        })
    test(`Досрочное завершение(новый ТД). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({earlyFinishRent}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await earlyFinishRent.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferRentSubTypeIds.earlyFinishRentWithNewContract
                });
                await expect(earlyFinishRent.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await earlyFinishRent.addContract(earlyFinishRent.newContractStartDate,earlyFinishRent.newContractEndDate);
                await expect(earlyFinishRent.numberValueByName(earlyFinishRent.employmentContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения без изменения сроков",async () => {
                await earlyFinishRent.addAdditionalAgreement(false,earlyFinishRent.newContractStartDate);
                await expect(earlyFinishRent.numberValueByName(earlyFinishRent.additionalAgreementWithoutChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного контракта",async () => {
                await earlyFinishRent.addTransferAgreement({});
                await expect(earlyFinishRent.numberValueByName(earlyFinishRent.transferContractNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await earlyFinishRent.addPayments(InstructionTypes.transferAgreementOnRentTerms);
                await expect(earlyFinishRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(earlyFinishRent.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(earlyFinishRent.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await earlyFinishRent.registrationInstruction();
                await expect(earlyFinishRent.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await earlyFinishRent.checkPrevContractsDateChanges(TransferRentSubTypeIds.earlyFinishRentWithNewContract,TransferContractTypeIds.withSuspension)).toBeTruthy();
                //await earlyFinishRent.checkFifaSending(FifaSendingActionTypes.transferDeclaration);
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await earlyFinishRent.addFactPayments(InstructionTypes.transferAgreement);
                await expect(earlyFinishRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(earlyFinishRent.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(earlyFinishRent.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
                //await earlyFinishRent.checkFifaSending(FifaSendingActionTypes.proofOfPayment);
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await earlyFinishRent.returnPaymentToPrevState();
                await expect(earlyFinishRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(earlyFinishRent.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(earlyFinishRent.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await earlyFinishRent.cancelPayment();
                await expect(earlyFinishRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
            await test.step("Формирование и загрузка на ПК печатной формы инструкции",async () => {
                const [actualReportName, expectedReportName] = await earlyFinishRent.printInstructionReport();
                expect(actualReportName).toBe(expectedReportName);
            })
            await test.step("Отмена регистрации инструкции",async () => {
                await earlyFinishRent.cancelRegistration();
                await earlyFinishRent.checkCancelRegistrationRequirements(earlyFinishRent.instructionId);
            })
        })
    test(`Досрочное завершение(изменение ТД). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({earlyFinishRent}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`},
            );
            await test.step("Создание инструкции", async () => {
                await earlyFinishRent.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferRentSubTypeIds.earlyFinishRentWithoutNewContract
                });
                await expect(earlyFinishRent.instructionName).toBeVisible();
            })
            await test.step("Наличие автоматически добавленного пред. договора с новым клубом",async () => {
                await expect(earlyFinishRent.numberValueByName(earlyFinishRent.employmentContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения без изменения сроков",async () => {
                await earlyFinishRent.addAdditionalAgreement(false,earlyFinishRent.newContractStartDate);
                await expect(earlyFinishRent.numberValueByName(earlyFinishRent.additionalAgreementWithoutChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного контракта",async () => {
                await earlyFinishRent.addTransferAgreement({instructionSubType: TransferRentSubTypeIds.earlyFinishRentWithoutNewContract});
                await expect(earlyFinishRent.numberValueByName(earlyFinishRent.transferContractNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await earlyFinishRent.addPayments(InstructionTypes.transferAgreementOnRentTerms);
                await expect(earlyFinishRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(earlyFinishRent.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(earlyFinishRent.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await earlyFinishRent.registrationInstruction();
                await expect(earlyFinishRent.instructionState(InstructionStates.registered)).toBeVisible();
                expect(await earlyFinishRent.checkPrevContractsDateChanges(TransferRentSubTypeIds.earlyFinishRentWithoutNewContract,TransferContractTypeIds.withSuspension)).toBeTruthy();
                await earlyFinishRent.checkFifaSending(FifaSendingActionTypes.transferDeclaration);
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await earlyFinishRent.addFactPayments(InstructionTypes.transferAgreement);
                await expect(earlyFinishRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(earlyFinishRent.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(earlyFinishRent.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
                await earlyFinishRent.checkFifaSending(FifaSendingActionTypes.proofOfPayment);
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await earlyFinishRent.returnPaymentToPrevState();
                await expect(earlyFinishRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(earlyFinishRent.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(earlyFinishRent.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await earlyFinishRent.cancelPayment();
                await expect(earlyFinishRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
            await test.step("Формирование и загрузка на ПК печатной формы инструкции",async () => {
                const [actualReportName, expectedReportName] = await earlyFinishRent.printInstructionReport();
                expect(actualReportName).toBe(expectedReportName);
            })
            await test.step("Отмена регистрации инструкции",async () => {
                await earlyFinishRent.cancelRegistration();
                await earlyFinishRent.checkCancelRegistrationRequirements(earlyFinishRent.instructionId);
            })
        })
})
