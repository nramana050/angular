export interface IInPageMenuItem {
    name: string;
    featureId: number;
    state?: string;
    icon?: string;
    description?: string;
    queryParams?: string;
    submenu?: IInPageMenuItem[];
}