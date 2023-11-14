import {test} from "../helpers/fixtures";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import * as Process from "process";
import {InputData} from "../helpers/InputData";
import config from "../../playwright.config";
import {expect} from "@playwright/test";
import 'dotenv/config'

test.describe("Инструкция с типом 'Трудовой договор'",() => {
    test(`Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({instruction}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: InputData.testAnnotationDate},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
            {type: "Адрес сервера",description: `${config.use?.baseURL}`}
        );
        await test.step("Создание инструкции с типом 'Трудовой договор'", async () => {
            await instruction.createInstruction(InstructionTypes.newEmploymentContract);
            await expect(instruction.instructionName).toBeVisible();
        })
        await test.step("Добавление трудового договора в инструкцию",async () => {
            await instruction.addContract();
            await expect(instruction.createContractNumber).toBeVisible();
        })
    })
})