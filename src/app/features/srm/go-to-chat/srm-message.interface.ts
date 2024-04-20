import { Time } from '@angular/common';

export interface Message {
    messageId?: string;
    messageTimestamp?: Time;
    messageText?: string;
    messageAttachmentLink?: string;
    messageSenderId?: number;
    isViewed?: boolean;
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
    isSameDate?: boolean;
}