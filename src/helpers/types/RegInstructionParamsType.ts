import {Page} from "@playwright/test";

export type RegInstructionParamsType = {
    page: Page,
    instructionId: number,
    regBeginDate: string,
    regEndDate: string,
    prevContractStopDate: null | string
}