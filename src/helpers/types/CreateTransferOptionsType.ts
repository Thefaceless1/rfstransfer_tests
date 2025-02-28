import {TransferContractTypeIds} from "../enums/TransferContractTypeIds";
import {TransferSubTypeIds} from "../enums/transferSubTypeIds";
import {TransferRentSubTypeIds} from "../enums/transferRentSubTypeIds";
import {IntTransferSubTypes} from "../enums/IntTransferSubTypes";

export type CreateTransferOptionsType = {
    transferContractType?: TransferContractTypeIds,
    isTransferForEarlyFinish?: boolean,
    instructionSubType?: TransferSubTypeIds | TransferRentSubTypeIds | IntTransferSubTypes
}