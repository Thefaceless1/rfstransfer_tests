import {Elements} from "./Elements";
import {Locator} from "@playwright/test";

export class DateInput extends Elements {
    /**
     * Fill a field with "Date" type
     */
    public static async fillDateInput(element: Locator, inputData: string): Promise<void> {
        await element.fill(inputData);
        await element.press("Enter");
    }
}