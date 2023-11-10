import {test} from "../helpers/fixtures";
import {CreateInstructionPage} from "../pages/CreateInstructionPage";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import * as Process from "process";
import {InputData} from "../helpers/InputData";
import config from "../../playwright.config";

test.describe("Трудовые договора",() => {
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
        })
    })
})