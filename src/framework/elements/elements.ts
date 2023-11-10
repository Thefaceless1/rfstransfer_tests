import {Locator} from "@playwright/test";

class Elements {
    /**
     * Ожидание видимости элемента
     */
    public async waitForVisible(element: Locator) {
        await element.waitFor({state: "visible"});
    }
    /**
     * Ожидание скрытия элемента
     */
    public async waitForHidden(element: Locator) {
        await element.waitFor({state: "hidden"});
    }
}
export const elements = new Elements();