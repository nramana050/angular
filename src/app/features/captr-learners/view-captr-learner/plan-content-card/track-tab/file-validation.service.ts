export class ErrorMessage {
    message: string;

    constructor( message: string) {
        this.message = message;
    }
}

export interface ErrorInput {
    id:any,
    message: string
}
