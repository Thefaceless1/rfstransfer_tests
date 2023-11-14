import {test as base} from '@playwright/test';
import {InstructionPage} from "../pages/InstructionPage";

type Fixtures = {
    instruction: InstructionPage
}

export const test = base.extend<Fixtures>({
    instruction: async ({page},use) => {
        const instruction = new InstructionPage(page);
        await use(instruction);
    }
})

