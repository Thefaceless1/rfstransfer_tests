export type AddTransferPayloadType = {
    number: string,
    conclusionDate: string,
    prevContractStopDate: string,
    note: string,
    files:[
        {
            storageId: string,
            fileName: string,
            isMain: boolean
        }],
    mediators: [],
    typeId: number,
    prevContractRestartDate?: string
}