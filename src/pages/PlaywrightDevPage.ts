import {Page} from "@playwright/test";

export class PlaywrightDevPage {
    protected readonly page: Page
    constructor(page: Page) {
        this.page = page
    }
}