import {CreateInstructionPage} from "./CreateInstructionPage";
import {Page} from "@playwright/test";

export class EmploymentContractPage extends CreateInstructionPage {
    constructor(page: Page) {
        super(page);
    }
}