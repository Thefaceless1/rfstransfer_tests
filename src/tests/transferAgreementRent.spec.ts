import {test} from "../helpers/fixtures";
import {InputData} from "../helpers/InputData";
import Process from "process";
import config from "../../playwright.config";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {expect} from "@playwright/test";
import {TransferAgreementRentSubTypes} from "../helpers/enums/TransferAgreementRentSubTypes";
import {TransferContractType} from "../helpers/enums/TransferContractType";
import {PaymentTypes} from "../helpers/enums/PaymentTypes";
import {InstructionStates} from "../helpers/enums/InstructionStates";
import {PaymentStates} from "../helpers/enums/PaymentStates";

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
                    subType: TransferAgreementRentSubTypes.toRent
                });
                await expect(transferRent.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transferRent.addContract(transferRent.newContractStartDate,transferRent.newContractEndDate);
                await expect(transferRent.numberValueByName(transferRent.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление трансферного контракта",async () => {
                await transferRent.addTransferAgreement({transferContractType: TransferContractType.withTermination});
                await expect(transferRent.numberValueByName(transferRent.createdTransferAgreementNumber)).toBeVisible();
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
                await expect(transferRent.regBeginDate).toHaveValue(transferRent.newContractStartDate);
                await expect(transferRent.regEndDate).toHaveValue(transferRent.newContractEndDate);
                expect(await transferRent.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.toRent,TransferContractType.withTermination)).toBeTruthy()
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await transferRent.addFactPayments(InstructionTypes.transferAgreement);
                await expect(transferRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
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
                    subType: TransferAgreementRentSubTypes.toRent
                });
                await expect(transferRent.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transferRent.addContract(transferRent.newContractStartDate,transferRent.newContractEndDate);
                await expect(transferRent.numberValueByName(transferRent.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление трансферного контракта",async () => {
                await transferRent.addTransferAgreement({transferContractType: TransferContractType.withSuspension});
                await expect(transferRent.numberValueByName(transferRent.createdTransferAgreementNumber)).toBeVisible();
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
                await expect(transferRent.regBeginDate).toHaveValue(transferRent.newContractStartDate);
                await expect(transferRent.regEndDate).toHaveValue(transferRent.newContractEndDate);
                expect(await transferRent.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.toRent,TransferContractType.withSuspension)).toBeTruthy()
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await transferRent.addFactPayments(InstructionTypes.transferAgreement);
                await expect(transferRent.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRent.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
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
        })
    test(`Продление аренды(новый ТД, новый ТК). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferRentProlongation}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferRentProlongation.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferAgreementRentSubTypes.prolongationNewContractNewTransfer
                });
                await expect(transferRentProlongation.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transferRentProlongation.addContract(transferRentProlongation.newContractStartDate,transferRentProlongation.newContractEndDate);
                await expect(transferRentProlongation.numberValueByName(transferRentProlongation.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление трансферного контракта",async () => {
                await transferRentProlongation.addTransferAgreement({transferContractType: TransferContractType.withSuspension});
                await expect(transferRentProlongation.numberValueByName(transferRentProlongation.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferRentProlongation.addPayments(InstructionTypes.transferAgreementOnRentTerms);
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRentProlongation.registrationInstruction();
                await expect(transferRentProlongation.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferRentProlongation.regBeginDate).toHaveValue(transferRentProlongation.newContractStartDate);
                await expect(transferRentProlongation.regEndDate).toHaveValue(transferRentProlongation.newContractEndDate);
                expect(await transferRentProlongation.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.prolongationNewContractNewTransfer,TransferContractType.withSuspension)).toBeTruthy()
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await transferRentProlongation.addFactPayments(InstructionTypes.transferAgreement);
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await transferRentProlongation.returnPaymentToPrevState();
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await transferRentProlongation.cancelPayment();
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
        })
    test(`Продление аренды(новый ТД, ДС к ТК). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferRentProlongation}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferRentProlongation.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferAgreementRentSubTypes.prolongationNewContract
                });
                await expect(transferRentProlongation.instructionName).toBeVisible();
            })
            await test.step("Наличие автоматически добавленного ТК",async () => {
                await expect(transferRentProlongation.numberValueByName(transferRentProlongation.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transferRentProlongation.addContract(transferRentProlongation.newContractStartDate,transferRentProlongation.newContractEndDate);
                await expect(transferRentProlongation.numberValueByName(transferRentProlongation.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление ДС к ТК",async () => {
                await transferRentProlongation.addAdditionalAgreementForTk();
                await expect(transferRentProlongation.numberValueByName(transferRentProlongation.additionalAgreementForTk)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferRentProlongation.addPayments(InstructionTypes.transferAgreementOnRentTerms);
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRentProlongation.registrationInstruction();
                await expect(transferRentProlongation.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferRentProlongation.regBeginDate).toHaveValue(transferRentProlongation.newContractStartDate);
                await expect(transferRentProlongation.regEndDate).toHaveValue(transferRentProlongation.newContractEndDate);
                expect(await transferRentProlongation.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.prolongationNewContract,TransferContractType.withSuspension)).toBeTruthy()
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await transferRentProlongation.addFactPayments(InstructionTypes.transferAgreement);
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await transferRentProlongation.returnPaymentToPrevState();
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await transferRentProlongation.cancelPayment();
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
        })
    test(`Продление аренды(ДС к ТД, новый ТК). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferRentProlongation}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferRentProlongation.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferAgreementRentSubTypes.prolongationNewTransfer
                });
                await expect(transferRentProlongation.instructionName).toBeVisible();
            })
            await test.step("Наличие автоматически добавленного пред. договора с новым клубом",async () => {
                await expect(transferRentProlongation.numberValueByName(transferRentProlongation.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения на продление",async () => {
                await transferRentProlongation.addAdditionalAgreement(true,transferRentProlongation.newContractStartDate);
                await expect(transferRentProlongation.numberValueByName(transferRentProlongation.additionalAgreementWithChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного контракта",async () => {
                await transferRentProlongation.addTransferAgreement({transferContractType: TransferContractType.withSuspension});
                await expect(transferRentProlongation.numberValueByName(transferRentProlongation.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferRentProlongation.addPayments(InstructionTypes.transferAgreementOnRentTerms);
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRentProlongation.registrationInstruction();
                await expect(transferRentProlongation.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferRentProlongation.regBeginDate).toHaveValue(transferRentProlongation.prevContractNewClubStartDate);
                await expect(transferRentProlongation.regEndDate).toHaveValue(transferRentProlongation.additionalAgreementDateEndByDs);
                expect(await transferRentProlongation.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.prolongationNewTransfer,TransferContractType.withSuspension)).toBeTruthy()
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await transferRentProlongation.addFactPayments(InstructionTypes.transferAgreement);
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await transferRentProlongation.returnPaymentToPrevState();
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await transferRentProlongation.cancelPayment();
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
        })
    test(`Продление аренды(ДС к ТД, ДС к ТК). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferRentProlongation}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferRentProlongation.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferAgreementRentSubTypes.prolongationWithoutNewContracts
                });
                await expect(transferRentProlongation.instructionName).toBeVisible();
            })
            await test.step("Наличие автоматически добавленного пред. договора с новым клубом",async () => {
                await expect(transferRentProlongation.numberValueByName(transferRentProlongation.createdContractNumber)).toBeVisible();
            })
            await test.step("Наличие автоматически добавленного ТК",async () => {
                await expect(transferRentProlongation.numberValueByName(transferRentProlongation.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения на продление",async () => {
                await transferRentProlongation.addAdditionalAgreement(true,transferRentProlongation.newContractStartDate);
                await expect(transferRentProlongation.numberValueByName(transferRentProlongation.additionalAgreementWithChangeDate)).toBeVisible();
            })
            await test.step("Добавление ДС к ТК",async () => {
                await transferRentProlongation.addAdditionalAgreementForTk();
                await expect(transferRentProlongation.numberValueByName(transferRentProlongation.additionalAgreementForTk)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferRentProlongation.addPayments(InstructionTypes.transferAgreementOnRentTerms);
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRentProlongation.registrationInstruction();
                await expect(transferRentProlongation.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferRentProlongation.regBeginDate).toHaveValue(transferRentProlongation.prevContractNewClubStartDate);
                await expect(transferRentProlongation.regEndDate).toHaveValue(transferRentProlongation.additionalAgreementDateEndByDs);
                expect(await transferRentProlongation.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.prolongationWithoutNewContracts,TransferContractType.withSuspension)).toBeTruthy()
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await transferRentProlongation.addFactPayments(InstructionTypes.transferAgreement);
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await transferRentProlongation.returnPaymentToPrevState();
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentProlongation.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await transferRentProlongation.cancelPayment();
                await expect(transferRentProlongation.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
        })
    test(`Досрочное завершение(новый ТД). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferRentEarlyFinish}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferRentEarlyFinish.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferAgreementRentSubTypes.earlyFinishRentWithNewContract
                });
                await expect(transferRentEarlyFinish.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transferRentEarlyFinish.addContract(transferRentEarlyFinish.newContractStartDate,transferRentEarlyFinish.newContractEndDate);
                await expect(transferRentEarlyFinish.numberValueByName(transferRentEarlyFinish.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения без изменения сроков",async () => {
                await transferRentEarlyFinish.addAdditionalAgreement(false,transferRentEarlyFinish.newContractStartDate);
                await expect(transferRentEarlyFinish.numberValueByName(transferRentEarlyFinish.additionalAgreementWithoutChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного контракта",async () => {
                await transferRentEarlyFinish.addTransferAgreement({});
                await expect(transferRentEarlyFinish.numberValueByName(transferRentEarlyFinish.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferRentEarlyFinish.addPayments(InstructionTypes.transferAgreementOnRentTerms);
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRentEarlyFinish.registrationInstruction();
                await expect(transferRentEarlyFinish.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferRentEarlyFinish.regBeginDate).toHaveValue(transferRentEarlyFinish.newContractStartDate);
                await expect(transferRentEarlyFinish.regEndDate).toHaveValue(transferRentEarlyFinish.newContractEndDate);
                expect(await transferRentEarlyFinish.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.earlyFinishRentWithNewContract,TransferContractType.withSuspension)).toBeTruthy()
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await transferRentEarlyFinish.addFactPayments(InstructionTypes.transferAgreement);
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await transferRentEarlyFinish.returnPaymentToPrevState();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await transferRentEarlyFinish.cancelPayment();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
        })
    test(`Досрочное завершение(изменение ТД). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferRentEarlyFinish}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции", async () => {
                await transferRentEarlyFinish.createInstruction({
                    type: InstructionTypes.transferAgreementOnRentTerms,
                    subType: TransferAgreementRentSubTypes.earlyFinishRentWithoutNewContract
                });
                await expect(transferRentEarlyFinish.instructionName).toBeVisible();
            })
            await test.step("Наличие автоматически добавленного пред. договора с новым клубом",async () => {
                await expect(transferRentEarlyFinish.numberValueByName(transferRentEarlyFinish.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения без изменения сроков",async () => {
                await transferRentEarlyFinish.addAdditionalAgreement(false,transferRentEarlyFinish.newContractStartDate);
                await expect(transferRentEarlyFinish.numberValueByName(transferRentEarlyFinish.additionalAgreementWithoutChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного контракта",async () => {
                await transferRentEarlyFinish.addTransferAgreement({instructionSubType: TransferAgreementRentSubTypes.earlyFinishRentWithoutNewContract});
                await expect(transferRentEarlyFinish.numberValueByName(transferRentEarlyFinish.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferRentEarlyFinish.addPayments(InstructionTypes.transferAgreementOnRentTerms);
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRentEarlyFinish.registrationInstruction();
                await expect(transferRentEarlyFinish.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferRentEarlyFinish.regBeginDate).toHaveValue(transferRentEarlyFinish.prevContractNewClubStartDate);
                await expect(transferRentEarlyFinish.regEndDate).toHaveValue(transferRentEarlyFinish.prevContractNewClubEndDate);
                expect(await transferRentEarlyFinish.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.earlyFinishRentWithoutNewContract,TransferContractType.withSuspension)).toBeTruthy()
            })
            await test.step("Добавление и подтверждение фактических платежей",async () => {
                await transferRentEarlyFinish.addFactPayments(InstructionTypes.transferAgreement);
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.fixedPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.conditionalPayment, PaymentStates.completed)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.resalePayment, PaymentStates.completed)).toBeVisible();
            })
            await test.step("Возврат выплат в предыдущий статус",async () => {
                await transferRentEarlyFinish.returnPaymentToPrevState();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.fixedPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.conditionalPayment, PaymentStates.expired)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.resalePayment, PaymentStates.waiting)).toBeVisible();
            })
            await test.step("Отмена выплаты",async () => {
                await transferRentEarlyFinish.cancelPayment();
                await expect(transferRentEarlyFinish.paymentState(PaymentTypes.fixedPayment, PaymentStates.cancelled)).toBeVisible();
            })
        })
})
