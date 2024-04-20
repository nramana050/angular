export interface ICustomer{
  id:number;
  identifier:String;
  clientName : String;
  createdDate:String;
  isActive:boolean;
  customerURL: String;
  primaryAppColour : String;
  secondaryAppColour : String;
  logoName : String;
  logoPath : String;
  isSUAppRequired: boolean;
  suAppDetails: any;
  clientApplicationMappingId: number;
  licences:number;
}
