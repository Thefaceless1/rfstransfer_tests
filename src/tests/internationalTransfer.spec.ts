import {test} from "../helpers/fixtures";
import * as Process from "process";
import {InputData} from "../helpers/InputData";
import config from "../../playwright.config";
import 'dotenv/config'
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {expect} from "@playwright/test";
import {IntTransferSubTypes} from "../helpers/enums/IntTransferSubTypes";
import {PlayerStates} from "../helpers/enums/PlayerStates";
import {InstructionStates} from "../helpers/enums/InstructionStates";
import {PaymentTypes} from "../helpers/enums/PaymentTypes";

test.describe.skip("Инструкция с типом 'Международный переход'",async () => {
    test(`Привлечь футболиста(Любитель). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({intTransfer}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции",async () => {
                await intTransfer.createInstruction({
                    type: InstructionTypes.internationalTransfer,
                    subType: IntTransferSubTypes.acceptAmateurPlayer
                });
                await expect(intTransfer.instructionName).toBeVisible();
            })
            await test.step("Добавление МТС",async () => {
                await intTransfer.addMts();
                await expect(intTransfer.mtsSavedNotification).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await intTransfer.registrationInstruction(PlayerStates.amateur);
                await expect(intTransfer.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(intTransfer.regBeginDate).toHaveValue(intTransfer.newContractStartDate);
                await expect(intTransfer.regEndDate).toHaveValue(intTransfer.newContractEndDate);
                await expect(intTransfer.registerCommentValue).toBeVisible();
            })
    })
    test(`Привлечь футболиста(Профессионал). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({intTransfer}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции",async () => {
                await intTransfer.createInstruction({
                    type: InstructionTypes.internationalTransfer,
                    subType: IntTransferSubTypes.acceptProfessionalPlayer
                });
                await expect(intTransfer.instructionName).toBeVisible();
                await expect(intTransfer.instructionTypeTitle(InstructionTypes.internationalTransfer)).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await intTransfer.addContract(intTransfer.newContractStartDate,intTransfer.newContractEndDate);
                await expect(intTransfer.numberValueByName(intTransfer.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения 'Без изменения срока действия ТД'",async () => {
                await intTransfer.addAdditionalAgreement(false,intTransfer.newContractStartDate);
                await expect(intTransfer.numberValueByName(intTransfer.additionalAgreementWithoutChangeDate)).toBeVisible();
            })
            await test.step("Добавление трансферного соглашения",async () => {
                await intTransfer.addRandomTransferContract();
                await expect(intTransfer.numberValueByName(intTransfer.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await intTransfer.addPayments(InstructionTypes.internationalTransfer);
                await expect(intTransfer.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(intTransfer.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(intTransfer.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(intTransfer.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Добавление МТС",async () => {
                await intTransfer.addMts();
                await expect(intTransfer.mtsSavedNotification).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await intTransfer.registrationInstruction(PlayerStates.amateur);
                await expect(intTransfer.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(intTransfer.regBeginDate).toHaveValue(intTransfer.newContractStartDate);
                await expect(intTransfer.regEndDate).toHaveValue(intTransfer.newContractEndDate);
                await expect(intTransfer.registerCommentValue).toBeVisible();
            })
        })
    test(`Отдать футболиста(Любитель). Версия модуля: ${Process.env.APP_VERSION}`,
        async ({intTransfer}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции",async () => {
                await intTransfer.createInstruction({
                    type: InstructionTypes.internationalTransfer,
                    subType: IntTransferSubTypes.giveAwayAmateurPlayer
                });
                await expect(intTransfer.instructionName).toBeVisible();
                await expect(intTransfer.instructionTypeTitle(InstructionTypes.internationalTransfer)).toBeVisible();
            })
            await test.step("Добавление МТС",async () => {
                await intTransfer.addMts(IntTransferSubTypes.giveAwayAmateurPlayer);
                await expect(intTransfer.mtsSavedNotification).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await intTransfer.registrationInstruction();
                await expect(intTransfer.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(intTransfer.prevContractStopDate).toHaveValue(intTransfer.prevContractNewClubStartDate);
                await expect(intTransfer.registerCommentValue).toBeVisible();
            })
        })
})