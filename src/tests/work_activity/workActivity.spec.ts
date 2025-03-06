import {test} from "../../helpers/fixtures";
import * as Process from "process";
import {InputData} from "../../helpers/InputData";
import config from "../../../playwright.config";
import {expect} from "@playwright/test";
import 'dotenv/config'
import {WorkActivityStates} from "../../helpers/enums/WorkActivityStates";

test.describe.only("Трудовая деятельность сотрудников",() => {
    test(`Версия модуля: ${Process.env.APP_VERSION}`,
        async ({workActivity}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Добавление записи о трудовой деятельности",async () => {
                await workActivity.addWorkActivity();
                await expect(workActivity.registerFormTitle).toBeVisible();
            })
            await test.step("Регистрация записи о трудовой деятельности",async () => {
                await workActivity.registerWorkActivity();
                await expect(workActivity.workActivityRegisteredMessage).toBeVisible();
            })
            await test.step("Редактирование зарегистрированной записи о трудовой деятельности",async () => {
                await workActivity.editWorkActivity(WorkActivityStates.registered);
                await expect(workActivity.workActivitySavedMessage).toBeVisible();
            })
            await test.step("Верификация записи о трудовой деятельности",async () => {
                await workActivity.verifyWorkActivity();
                await expect(workActivity.verifiedIcon).toBeVisible();
            })
            await test.step("Редактирование верифицированной записи о трудовой деятельности",async () => {
                await workActivity.editWorkActivity(WorkActivityStates.verified);
                await expect(workActivity.reverificationRequiredIcon).toBeVisible();
            })
        })
})