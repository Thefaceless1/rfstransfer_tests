import {test} from "../helpers/fixtures";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import * as Process from "process";
import {InputData} from "../helpers/InputData";
import config from "../../playwright.config";
import {expect} from "@playwright/test";
import 'dotenv/config'
import {InstructionStates} from "../helpers/enums/InstructionStates";
import {PaymentTypes} from "../helpers/enums/PaymentTypes";

test.describe("Инструкция с типом 'Трудовой договор'",() => {
    test(`Версия модуля: ${Process.env.APP_VERSION}`,
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
        await test.step("Добавление планового платежа 'Выплата за расторжение(выкуп)'",async () => {
            await employmentContract.addPayments(InstructionTypes.newEmploymentContract);
            await expect(employmentContract.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
        })
        await test.step("Регистрация инструкции",async () => {
            await employmentContract.registrationInstruction();
            await expect(employmentContract.instructionState(InstructionStates.registered)).toBeVisible();
            await expect(employmentContract.registerCommentValue).toBeVisible();
            await expect(employmentContract.regBeginDate).toHaveValue(employmentContract.prevContractPrevClubStartDate);
            await expect(employmentContract.regEndDate).toHaveValue(String(employmentContract.prevContractPrevClubEndDate));
        })
    })
})