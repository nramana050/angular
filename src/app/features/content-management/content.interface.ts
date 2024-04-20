export interface Content {
}

export interface IEstablishment {
    id: number,
    organizationName: string,
    lotName: string;
    checked: boolean;
}

export interface ILotname {
    name: string;
}

export interface IKeyword {
    id: number;
    keywordName: string;
    removable: boolean;
    invisible: boolean;
}

export interface IContentModule {
    id: number;
    name: string;
    sequance: number;
    statusName: string;
    description: string;
    status: string;
}
