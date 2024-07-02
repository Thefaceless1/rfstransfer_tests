export enum TransferAgreementRentSubTypes {
    toRent = "Взять в аренду",
    prolongationNewContractNewTransfer = "Продление аренды (новый ТД, новый ТК)",
    prolongationNewContract = "Продление аренды (новый ТД, продление ТК)",
    prolongationNewTransfer = "Продление аренды (ДС к ТД, новый ТК)",
    prolongationWithoutNewContracts = "Продление аренды (ДС к ТД, ДС к ТК)",
    earlyFinishRentWithNewContract = "Досрочное завершение аренды (новый ТД)",
    earlyFinishRentWithoutNewContract = "Продление аренды (изменение ТД)",
}