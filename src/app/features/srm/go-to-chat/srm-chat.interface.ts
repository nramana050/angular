export interface Chat {
  status: string;
    chatId?: number;
    messageFromId?: number;
    messageToId?: number;
    messageFromName?: string;
    messageToName?: string;
    isChatActive?: boolean;
    isActive?: boolean;
    isDeleted?: boolean;
    createdById?: number;
    createdDate?: Date;
    createdByName?: string;
    modifiedById?: number;
    modifiedDate?: Date;
    modifiedByName?: string;
    deletedById?: number;
    deletedDate?: Date;
    deletedByName?: string;
    chatFrom?: string;
}
