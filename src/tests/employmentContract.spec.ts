import {test} from "../helpers/fixtures";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import * as Process from "process";
import {InputData} from "../helpers/InputData";
import config from "../../playwright.config";
import {expect} from "@playwright/test";
import 'dotenv/config'
import {InstructionStateIds} from "../helpers/enums/InstructionStateIds";
import {InstructionStates} from "../helpers/enums/InstructionStates";

test.describe("Инструкция с типом 'Трудовой договор'",() => {
    test(`Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({employmentContract}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: InputData.testAnnotationDate},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
            {type: "Адрес сервера",description: `${config.use?.baseURL}`}
        );
        await test.step("Создание инструкции с типом 'Трудовой договор'", async () => {
            await employmentContract.createInstruction({
                type: InstructionTypes.newEmploymentContract,
                clubId: employmentContract.srcClubId
            });
            await expect(employmentContract.instructionName).toBeVisible();
        })
        await test.step("Добавление трудового договора",async () => {
            await employmentContract.addContract(employmentContract.prevContractPrevClubStartDate,employmentContract.prevContractPrevClubEndDate);
            await expect(employmentContract.numberValueByName(employmentContract.createdContractNumber)).toBeVisible();
        })
        await test.step("Добавление дополнительного соглашения",async () => {
            await employmentContract.addAdditionalAgreement(false,employmentContract.prevContractPrevClubStartDate);
            await expect(employmentContract.numberValueByName(employmentContract.additionalAgreementWithoutChangeDate)).toBeVisible();
        })
        await test.step("Удаление дополнительного соглашения",async () => {
            await employmentContract.deleteAdditionalAgreement();
            await expect(employmentContract.numberValueByName(employmentContract.additionalAgreementWithoutChangeDate)).not.toBeVisible();
        })
        await test.step("Отправка инструкции на регистрацию",async () => {
            await employmentContract.updateInstructionState(InstructionStateIds.onRegistration);
            await expect(employmentContract.instructionState(InstructionStates.onRegistration)).toBeVisible();
            await expect(employmentContract.regBeginDate).toHaveValue(employmentContract.prevContractPrevClubStartDate);
            await expect(employmentContract.regEndDate).toHaveValue(String(employmentContract.prevContractPrevClubEndDate));
        })
        await test.step("Назначение себя ответственным на инструкцию",async () => {
            await employmentContract.nominationYourselfForInstruction();
            expect(await employmentContract.currentUser.innerText()).toBe(await employmentContract.nominatedUser.innerText());
        })
        await test.step("Отправка инструкции на доработку",async () => {
            await employmentContract.updateInstructionState(InstructionStateIds.onCorrection);
            await expect(employmentContract.instructionState(InstructionStates.onCorrection)).toBeVisible();
            await expect(employmentContract.correctionReasonValue).toBeVisible();
        })
        await test.step("Регистрация инструкции",async () => {
            await employmentContract.updateInstructionState(InstructionStateIds.registered);
            await expect(employmentContract.instructionState(InstructionStates.registered)).toBeVisible();
            await expect(employmentContract.registerCommentValue).toBeVisible();
        })
    })
})