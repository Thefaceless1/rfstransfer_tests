import {test} from "../helpers/fixtures";
import * as Process from "process";
import {InputData} from "../helpers/InputData";
import config from "../../playwright.config";
import 'dotenv/config'
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {expect} from "@playwright/test";
import {InstructionStateIds} from "../helpers/enums/InstructionStateIds";
import {InstructionStates} from "../helpers/enums/InstructionStates";

test.describe("Инструкция с типом 'Дополнительное соглашение'",() => {
    test(`Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({additionalAgreement}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции с типом 'Дополнительное соглашение'", async () => {
                await additionalAgreement.createInstruction(InstructionTypes.additionalAgreement);
                await expect(additionalAgreement.instructionName).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения",async () => {
                await additionalAgreement.addContract("additionalAgreement");
                await expect(additionalAgreement.numberValueByName(additionalAgreement.createdAdditionalAgreementNumber)).toBeVisible();
            })
            await test.step("Отмена инструкции",async () => {
                await additionalAgreement.updateInstructionState(InstructionStateIds.cancelled);
                await expect(additionalAgreement.instructionState(InstructionStates.cancelled)).toBeVisible();
            })
            await test.step("Отправка инструкции на регистрацию",async () => {
                await additionalAgreement.updateInstructionState(InstructionStateIds.onRegistration);
                await expect(additionalAgreement.instructionState(InstructionStates.onRegistration)).toBeVisible();
            })
            await test.step("Отправка инструкции на доработку",async () => {
                await additionalAgreement.updateInstructionState(InstructionStateIds.underRevision);
                await expect(additionalAgreement.instructionState(InstructionStates.underRevision)).toBeVisible();
            })
            await test.step("Отмена регистрации инструкции",async () => {
                await additionalAgreement.updateInstructionState(InstructionStateIds.registerCancelled);
                await expect(additionalAgreement.instructionState(InstructionStates.registerCancelled)).toBeVisible();
            })
            await test.step("Отклонение инструкции",async () => {
                await additionalAgreement.updateInstructionState(InstructionStateIds.declined);
                await expect(additionalAgreement.instructionState(InstructionStates.declined)).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await additionalAgreement.updateInstructionState(InstructionStateIds.registered);
                await expect(additionalAgreement.instructionState(InstructionStates.registered)).toBeVisible();
            })
        })
})