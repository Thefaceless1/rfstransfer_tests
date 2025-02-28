import {TransferSubTypeIds} from "../enums/transferSubTypeIds";
import {TransferRentSubTypeIds} from "../enums/transferRentSubTypeIds";
import {InstructionTypeIds} from "../enums/InstructionTypeIds";

export type CreateInstructionPayloadType = {
    typeId: InstructionTypeIds | null,
    subTypeId?: TransferSubTypeIds | TransferRentSubTypeIds
    clubId: number | null,
    srcClubId: number | null,
    srcNAId: number | null,
    destNAId: number | null,
    personId: number | null
}