import {Locator} from "@playwright/test";

export class Elements {
    /**
     * Ожидание видимости элемента
     */
    public static async waitForVisible(element: Locator, timeout?: number) {
        (timeout) ?
            await element.waitFor({state: "visible", timeout: timeout}):
            await element.waitFor({state: "visible"});
    }
    /**
     * Ожидание скрытия элемента
     */
    public static async waitForHidden(element: Locator, timeout?: number) {
        (timeout) ?
            await element.waitFor({state: "hidden",timeout: timeout}):
            await element.waitFor({state: "hidden"});
    }
}