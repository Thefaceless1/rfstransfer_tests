import {Page} from "@playwright/test";

export type AddWorkActivityParamsType = {
    page: Page,
    orgId: number,
    personId: number
}