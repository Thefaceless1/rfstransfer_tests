export type AddContractPayloadType = {
    number: string,
    conclusionDate: string,
    beginDate: string,
    isParentContractChange: boolean,
    endDate: string,
    note: string,
    files:[
        {
            storageId: string,
            fileName: string,
            isMain: boolean
        }],
    mediators:[],
    parentContractId: number | null
}