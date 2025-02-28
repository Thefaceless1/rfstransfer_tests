export type GetInstructionResponseType = {
    status: string,
    data: {
        id: number,
        createDate: string,
        typeId: number,
        type: string,
        subTypeId: number,
        personId: number,
        clubId: number,
        srcClubId: number,
        designatedEmployeeId: number,
        stateId: number,
        state: string,
        isAdmin: boolean,
        regBeginDate: string,
        regEndDate: string,
        regNote: string,
        regFiles: [],
        isOtherMemberAssociation: boolean,
        parentContractId: number,
        contracts: [],
        transfer: number,
        isViolationTransferWindow: boolean,
        tmsTransferId: number,
        collisions: [],
        collisionsCheckDate: string,
        prevContractStopDate: string,
        prevContractRestartDate: string,
        prevContractTermination: string,
        isMigrated: boolean,
        skipHistoryChange: boolean,
        internationalTransferCert: number,
        isProfessional: boolean,
        isTemporary: boolean,
        possibleRegEndDate: string,
        payments: [],
        srcNAId: number,
        destNAId: number,
        disciplineId: number,
        disciplineName: string
    }
}