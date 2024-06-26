import { EventEmitter } from '@angular/core';

export interface Confirmation {
    message: string;
    key?: string;
    icon?: string;
    header?: string;
    accept?: Function;
    reject?: Function;
    acceptVisible?: boolean;
    rejectVisible?: boolean;
    acceptEvent?: EventEmitter<any>;
    rejectEvent?: EventEmitter<any>;
    acceptLabel?:string;
    rejectLabel?:string;
    showClose?: boolean;
    hasSecondPopup?: boolean;
    showTimer?: boolean;
    countdown?: number; 
}
