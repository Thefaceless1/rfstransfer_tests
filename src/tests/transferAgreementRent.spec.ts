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
                await transferRent.addPayments();
                await expect(transferRent.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferRent.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferRent.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferRent.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRent.registrationInstruction();
                await expect(transferRent.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferRent.regBeginDate).toHaveValue(transferRent.newContractStartDate);
                await expect(transferRent.regEndDate).toHaveValue(transferRent.newContractEndDate);
                expect(await transferRent.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.toRent,TransferContractType.withTermination)).toBeTruthy()
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
                await transferRent.addPayments();
                await expect(transferRent.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferRent.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferRent.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferRent.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRent.registrationInstruction();
                await expect(transferRent.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferRent.regBeginDate).toHaveValue(transferRent.newContractStartDate);
                await expect(transferRent.regEndDate).toHaveValue(transferRent.newContractEndDate);
                expect(await transferRent.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.toRent,TransferContractType.withSuspension)).toBeTruthy()
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
                await transferRentProlongation.addPayments();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRentProlongation.registrationInstruction();
                await expect(transferRentProlongation.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferRentProlongation.regBeginDate).toHaveValue(transferRentProlongation.newContractStartDate);
                await expect(transferRentProlongation.regEndDate).toHaveValue(transferRentProlongation.newContractEndDate);
                expect(await transferRentProlongation.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.prolongationNewContractNewTransfer,TransferContractType.withSuspension)).toBeTruthy()
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
                await transferRentProlongation.addPayments();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRentProlongation.registrationInstruction();
                await expect(transferRentProlongation.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferRentProlongation.regBeginDate).toHaveValue(transferRentProlongation.newContractStartDate);
                await expect(transferRentProlongation.regEndDate).toHaveValue(transferRentProlongation.newContractEndDate);
                expect(await transferRentProlongation.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.prolongationNewContract,TransferContractType.withSuspension)).toBeTruthy()
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
                await transferRentProlongation.addPayments();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRentProlongation.registrationInstruction();
                await expect(transferRentProlongation.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferRentProlongation.regBeginDate).toHaveValue(transferRentProlongation.earlyFinishPrevContractStartDate);
                await expect(transferRentProlongation.regEndDate).toHaveValue(transferRentProlongation.additionalAgreementDateEndByDs);
                expect(await transferRentProlongation.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.prolongationNewTransfer,TransferContractType.withSuspension)).toBeTruthy()
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
                await transferRentProlongation.addPayments();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferRentProlongation.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRentProlongation.registrationInstruction();
                await expect(transferRentProlongation.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferRentProlongation.regBeginDate).toHaveValue(transferRentProlongation.earlyFinishPrevContractStartDate);
                await expect(transferRentProlongation.regEndDate).toHaveValue(transferRentProlongation.additionalAgreementDateEndByDs);
                expect(await transferRentProlongation.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.prolongationWithoutNewContracts,TransferContractType.withSuspension)).toBeTruthy()
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
                await transferRentEarlyFinish.addPayments();
                await expect(transferRentEarlyFinish.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRentEarlyFinish.registrationInstruction();
                await expect(transferRentEarlyFinish.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferRentEarlyFinish.regBeginDate).toHaveValue(transferRentEarlyFinish.newContractStartDate);
                await expect(transferRentEarlyFinish.regEndDate).toHaveValue(transferRentEarlyFinish.newContractEndDate);
                expect(await transferRentEarlyFinish.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.earlyFinishRentWithNewContract,TransferContractType.withSuspension)).toBeTruthy()
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
                await transferRentEarlyFinish.addPayments();
                await expect(transferRentEarlyFinish.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferRentEarlyFinish.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await transferRentEarlyFinish.registrationInstruction();
                await expect(transferRentEarlyFinish.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(transferRentEarlyFinish.regBeginDate).toHaveValue(transferRentEarlyFinish.prevContractNewClubStartDate);
                await expect(transferRentEarlyFinish.regEndDate).toHaveValue(transferRentEarlyFinish.prevContractNewClubEndDate);
                expect(await transferRentEarlyFinish.checkPrevContractsDateChanges(TransferAgreementRentSubTypes.earlyFinishRentWithoutNewContract,TransferContractType.withSuspension)).toBeTruthy()
            })
        })
})
