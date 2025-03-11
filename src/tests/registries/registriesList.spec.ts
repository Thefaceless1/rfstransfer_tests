import {test} from "../../helpers/fixtures";
import Process from "process";
import {InputData} from "../../helpers/InputData";
import config from "../../../playwright.config";
import {RegistriesValues} from "../../helpers/enums/RegistriesValues";
import {expect} from "@playwright/test";

test.describe("Реестры",() => {
    test(`Список инструкций. Версия модуля: ${Process.env.APP_VERSION}`,
        async ({registry}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Выгрузка списка инструкций в excel", async () => {
                await registry.exportRegistryToExcel(RegistriesValues.instructionList);
            })
            await test.step("Назначение себя ответственным на инструкцию", async () => {
                await registry.nominateResponsiblePerson(true);
            })
            await test.step("Назначение ответственного из списка на инструкцию", async () => {
                await registry.nominateResponsiblePerson(false);
            })
        })
    test(`Реестр трудовых договоров. Версия модуля: ${Process.env.APP_VERSION}`,
        async ({registry}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Выгрузка реестра трудовых договоров в excel", async () => {
                await registry.exportRegistryToExcel(RegistriesValues.contractsRegistry);
            })
        })
    test(`Реестр платежей. Версия модуля: ${Process.env.APP_VERSION}`,
        async ({registry}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Выгрузка реестра платежей в excel", async () => {
                await registry.exportRegistryToExcel(RegistriesValues.paymentsRegistry);
            })
        })
    test(`Реестр трансферов. Версия модуля: ${Process.env.APP_VERSION}`,
        async ({registry}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Выгрузка реестра трансферов в excel", async () => {
                await registry.exportRegistryToExcel(RegistriesValues.transferRegistry);
            })
        })
    test(`Реестр отправки сведений в ФИФА. Версия модуля: ${Process.env.APP_VERSION}`,
        async ({registry}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Выгрузка реестра отправки сведений в ФИФА в excel", async () => {
                await registry.exportRegistryToExcel(RegistriesValues.fifaSendingRegistry);
            })
        })
    test(`Реестр сотрудников. Версия модуля: ${Process.env.APP_VERSION}`,
        {tag: "@employeeRegistry"},
        async ({registry}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step("Выгрузка реестра сотрудников в excel", async () => {
                await registry.exportRegistryToExcel(RegistriesValues.employeeRegistry);
            })
            await test.step("Массовая верификация трудовой деятельности", async () => {
                await registry.massVerifyWorkActivity();
                await expect(registry.verifiedRecord).toBeVisible();
            })
            await test.step("Массовое завершение трудовой деятельности", async () => {
                await registry.massEndWorkActivity();
                await expect(registry.completedRecord).toBeVisible();
            })
        })
})