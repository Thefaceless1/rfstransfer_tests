import {test} from "../../helpers/fixtures";
import Process from "process";
import {InputData} from "../../helpers/InputData";
import config from "../../../playwright.config";
import {RegistriesValues} from "../../helpers/enums/RegistriesValues";

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
})