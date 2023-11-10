import {test as base} from '@playwright/test';
import {EmploymentContractPage} from "../pages/EmploymentContractPage";

type Fixtures = {
    employmentContract: EmploymentContractPage
}

export const test = base.extend<Fixtures>({
    employmentContract: async ({page},use) => {
        const employmentContract = new EmploymentContractPage(page);
        await use(employmentContract);
    }
})

