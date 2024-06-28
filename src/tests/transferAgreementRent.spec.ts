import {test} from "../helpers/fixtures";
import {InputData} from "../helpers/InputData";
import Process from "process";
import config from "../../playwright.config";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {expect} from "@playwright/test";
import {PaymentTypes} from "../helpers/enums/PaymentTypes";
import {InstructionStateIds} from "../helpers/enums/InstructionStateIds";
import {InstructionStates} from "../helpers/enums/InstructionStates";

test.describe.skip("Инструкция с типом 'Переход на временной основе (аренда)'",() => {
    test(`Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({transferAgreementRent}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Создание инструкции с типом 'Переход на временной основе (аренда)'", async () => {
                await transferAgreementRent.createInstruction(InstructionTypes.transferAgreementOnRentTerms);
                await expect(transferAgreementRent.instructionName).toBeVisible();
            })
            await test.step("Добавление трудового договора",async () => {
                await transferAgreementRent.addContract("employmentContact");
                await expect(transferAgreementRent.numberValueByName(transferAgreementRent.createdContractNumber)).toBeVisible();
            })
            await test.step("Добавление дополнительного соглашения",async () => {
                await transferAgreementRent.addContract("additionalAgreement");
                await expect(transferAgreementRent.numberValueByName(transferAgreementRent.createdAdditionalAgreementNumber)).toBeVisible();
            })
            await test.step("Удаление дополнительного соглашения",async () => {
                await transferAgreementRent.deleteAdditionalAgreement();
                await expect(transferAgreementRent.numberValueByName(transferAgreementRent.createdAdditionalAgreementNumber)).not.toBeVisible();
            })
            await test.step("Добавление трансферного соглашения",async () => {
                await transferAgreementRent.addContract("transferAgreementRent");
                await expect(transferAgreementRent.numberValueByName(transferAgreementRent.createdTransferAgreementNumber)).toBeVisible();
            })
            await test.step("Добавление платежей",async () => {
                await transferAgreementRent.addPayments();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.fixedPayment)).toBeVisible();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.ransomPayment)).toBeVisible();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.conditionalPayment)).toBeVisible();
                await expect(transferAgreementRent.paymentTypeColumnValue(PaymentTypes.resalePayment)).toBeVisible();
            })
            await test.step("Отправка инструкции на регистрацию",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.onRegistration);
                await expect(transferAgreementRent.instructionState(InstructionStates.onRegistration)).toBeVisible();
                await expect(transferAgreementRent.regBeginDate).toHaveValue(String(InputData.currentDate));
                await expect(transferAgreementRent.regEndDate).toHaveValue(String(InputData.futureDate(transferAgreementRent.contractDurationDays)));
            })
            await test.step("Проверка инструкции на коллизии с изменением периода регистрации",async () => {
                await transferAgreementRent.checkCollision();
                await expect(transferAgreementRent.regEndDate).toHaveValue(String(InputData.futureDate(transferAgreementRent.contractDurationDays)));
            })
            await test.step("Назначение себя ответственным на инструкцию",async () => {
                await transferAgreementRent.nominationYourselfForInstruction();
                expect(await transferAgreementRent.currentUser.innerText()).toBe(await transferAgreementRent.nominatedUser.innerText());
            })
            await test.step("Отправка инструкции на доработку",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.onCorrection);
                await expect(transferAgreementRent.instructionState(InstructionStates.underRevision)).toBeVisible();
            })
            await test.step("Отклонение регистрации инструкции",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.declined);
                await expect(transferAgreementRent.instructionState(InstructionStates.declined)).toBeVisible();
            })
            /*await test.step("Регистрация инструкции",async () => {
                await transferAgreementRent.updateInstructionState(InstructionStateIds.registered);
                await expect(transferAgreementRent.instructionState(InstructionStates.registered)).toBeVisible();
            })*/
        })
})