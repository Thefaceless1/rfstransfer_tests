import {test} from "../helpers/fixtures";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import * as Process from "process";
import {InputData} from "../helpers/InputData";
import config from "../../playwright.config";
import {expect} from "@playwright/test";
import 'dotenv/config'
import {InstructionStateIds} from "../helpers/enums/InstructionStateIds";
import {InstructionStates} from "../helpers/enums/InstructionStates";

test.describe.only("Инструкция с типом 'Трудовой договор'",() => {
    test(`Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({employmentContract}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: InputData.testAnnotationDate},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
            {type: "Адрес сервера",description: `${config.use?.baseURL}`}
        );
        await test.step("Создание инструкции с типом 'Трудовой договор'", async () => {
            await employmentContract.createInstruction(InstructionTypes.newEmploymentContract);
            await expect(employmentContract.instructionName).toBeVisible();
        })
        await test.step("Добавление трудового договора в инструкцию",async () => {
            await employmentContract.addContract("employmentContact");
            await expect(employmentContract.numberValueByName(employmentContract.createdContractNumber)).toBeVisible();
        })
        await test.step("Изменение трудового договора",async () => {
            await employmentContract.editContract();
            await expect(employmentContract.numberValueByName(employmentContract.createdContractNumber)).toBeVisible();
        })
        await test.step("Добавление дополнительного соглашения",async () => {
            await employmentContract.addContract("additionalAgreement");
            await expect(employmentContract.numberValueByName(employmentContract.createdAdditionalAgreementNumber)).toBeVisible();
        })
        await test.step("Удаление дополнительного соглашения",async () => {
            await employmentContract.deleteAdditionalAgreement();
            await expect(employmentContract.numberValueByName(employmentContract.createdAdditionalAgreementNumber)).not.toBeVisible();
        })
        await test.step("Отмена инструкции",async () => {
            await employmentContract.updateInstructionState(InstructionStateIds.cancelled);
            await expect(employmentContract.instructionState(InstructionStates.cancelled)).toBeVisible();
        })
        await test.step("Отправка инструкции на регистрацию",async () => {
            await employmentContract.updateInstructionState(InstructionStateIds.onRegistration);
            await expect(employmentContract.instructionState(InstructionStates.onRegistration)).toBeVisible();
        })
        await test.step("Отправка инструкции на доработку",async () => {
            await employmentContract.updateInstructionState(InstructionStateIds.underRevision);
            await expect(employmentContract.instructionState(InstructionStates.underRevision)).toBeVisible();
        })
        await test.step("Отмена регистрации инструкции",async () => {
            await employmentContract.updateInstructionState(InstructionStateIds.registerCancelled);
            await expect(employmentContract.instructionState(InstructionStates.registerCancelled)).toBeVisible();
        })
        await test.step("Отклонение инструкции",async () => {
            await employmentContract.updateInstructionState(InstructionStateIds.declined);
            await expect(employmentContract.instructionState(InstructionStates.declined)).toBeVisible();
        })
        await test.step("Регистрация инструкции",async () => {
            await employmentContract.updateInstructionState(InstructionStateIds.registered);
            await expect(employmentContract.instructionState(InstructionStates.registered)).toBeVisible();
        })
    })
})