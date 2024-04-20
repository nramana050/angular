export interface IUser {

  id: number;
  accountType: string;
  accountState?: boolean;
  title?: string;
  firstName: string;
  lastName: string;
  userName: string;
  emailAddress: string;
  phoneNumber?: string;
  userTypeId: number; 
  orgList?: Array<any>;
  
}
