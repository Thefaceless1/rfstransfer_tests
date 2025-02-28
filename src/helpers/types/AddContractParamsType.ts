import {Page} from "@playwright/test";

export type AddContractParamsType = {
    page: Page,
    instructionId: number,
    startDate: string,
    endDate: string,
    contractNumber: string
}