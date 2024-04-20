export interface IAgent  {
    agentId: string;
    name: string;
}

export interface IUserMessage {
    errorMessage?: string;
}

export interface IVerifyResponseData {
    agentList?: IAgent[];
    message?: IUserMessage;
}

export interface ISignInResponseData  {
    userInfo?: string;
    message?: IUserMessage;
    token?: string;
}

export interface IUser {
    orgId: number;
    sub: string;
    roleId: number;
    uid: string;
    userId: number;
    userName: string;
    listResource: any[];
}
