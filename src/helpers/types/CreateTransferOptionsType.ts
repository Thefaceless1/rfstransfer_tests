import {TransferContractType} from "../enums/TransferContractType";
import {TransferAgreementSubTypes} from "../enums/TransferAgreementSubTypes";
import {TransferAgreementRentSubTypes} from "../enums/TransferAgreementRentSubTypes";
import {IntTransferSubTypes} from "../enums/IntTransferSubTypes";

export type CreateTransferOptionsType = {
    transferContractType?: TransferContractType,
    isTransferForEarlyFinish?: boolean,
    instructionSubType?: TransferAgreementSubTypes | TransferAgreementRentSubTypes | IntTransferSubTypes
}