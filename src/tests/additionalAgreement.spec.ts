import {test} from "../helpers/fixtures";
import * as Process from "process";
import {InputData} from "../helpers/InputData";
import config from "../../playwright.config";
import 'dotenv/config'
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {expect} from "@playwright/test";
import {InstructionStateIds} from "../helpers/enums/InstructionStateIds";
import {InstructionStates} from "../helpers/enums/InstructionStates";

test.describe("Инструкция с типом 'Изменение трудового договора'",() => {
    test(`Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({additionalAgreement}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции с типом 'Изменение трудового договора'", async () => {
                await additionalAgreement.createInstruction({
                    type: InstructionTypes.additionalAgreement,
                    clubId: additionalAgreement.srcClubId
                });
                await expect(additionalAgreement.instructionName).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения 'С изменением срока действия ТД'",async () => {
                await additionalAgreement.addAdditionalAgreement(true,additionalAgreement.prevContractPrevClubStartDate);
                await expect(additionalAgreement.numberValueByName(additionalAgreement.additionalAgreementWithChangeDate)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения 'Без изменения срока действия ТД'",async () => {
                await additionalAgreement.addAdditionalAgreement(false,additionalAgreement.prevContractPrevClubStartDate);
                await expect(additionalAgreement.numberValueByName(additionalAgreement.additionalAgreementWithoutChangeDate)).toBeVisible();
            })
            await test.step("Отправка инструкции на регистрацию",async () => {
                await additionalAgreement.updateInstructionState(InstructionStateIds.onRegistration);
                await expect(additionalAgreement.instructionState(InstructionStates.onRegistration)).toBeVisible();
                await expect(additionalAgreement.regBeginDate).toHaveValue(additionalAgreement.prevContractPrevClubStartDate);
                await expect(additionalAgreement.regEndDate).toHaveValue(additionalAgreement.additionalAgreementDateEndByDs);
            })
            await test.step("Назначение себя ответственным на инструкцию",async () => {
                await additionalAgreement.nominationYourselfForInstruction();
                expect(await additionalAgreement.currentUser.innerText()).toBe(await additionalAgreement.nominatedUser.innerText());
            })
            await test.step("Отправка инструкции на доработку",async () => {
                await additionalAgreement.updateInstructionState(InstructionStateIds.onCorrection);
                await expect(additionalAgreement.instructionState(InstructionStates.onCorrection)).toBeVisible();
                await expect(additionalAgreement.correctionReasonValue).toBeVisible();
            })
            await test.step("Регистрация инструкции",async () => {
                await additionalAgreement.updateInstructionState(InstructionStateIds.registered);
                await expect(additionalAgreement.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(additionalAgreement.registerCommentValue).toBeVisible();
            })
        })
})