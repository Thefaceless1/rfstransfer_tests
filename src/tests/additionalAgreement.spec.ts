import {test} from "../helpers/fixtures";
import * as Process from "process";
import {InputData} from "../helpers/InputData";
import config from "../../playwright.config";
import 'dotenv/config'
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {expect} from "@playwright/test";
import {InstructionStates} from "../helpers/enums/InstructionStates";
import {FifaSendingActionTypes} from "../helpers/enums/FifaSendingActionTypes";

test.describe("Инструкция с типом 'Изменение трудового договора'",() => {
    test(`Версия модуля: ${Process.env.APP_VERSION}`,
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
            await test.step("Регистрация инструкции",async () => {
                await additionalAgreement.registrationInstruction();
                await expect(additionalAgreement.instructionState(InstructionStates.registered)).toBeVisible();
                await expect(additionalAgreement.regBeginDate).toHaveValue(additionalAgreement.prevContractPrevClubStartDate);
                await expect(additionalAgreement.regEndDate).toHaveValue(additionalAgreement.additionalAgreementDateEndByDs);
                await expect(additionalAgreement.registerCommentValue).toBeVisible();
                await additionalAgreement.checkFifaSending(FifaSendingActionTypes.firstProRegistration);
            })
            await test.step("Формирование и загрузка на ПК печатной формы инструкции",async () => {
                const [actualReportName, expectedReportName] = await additionalAgreement.printInstructionReport();
                expect(actualReportName).toBe(expectedReportName);
            })
        })
})