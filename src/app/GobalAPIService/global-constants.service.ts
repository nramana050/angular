import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalConstantsService {

  constructor() { }
  //payment key
     public static key: string = 'pk_live_51IRXdtHxSEPGrWnwy7KHPU6ecsEgJPSaiv6riN7gIkg6SufSrjxuyuUhUntbCmAyo8xEPeBs0ebymi1fHp3si9CW00UKwDnHwj';// live 
  // public static key: string = 'pk_test_51IRXdtHxSEPGrWnwLJ4Nm5hZQ2mR9bCpf0CCfmffO2wLKhMwTBsJJvGLx7pTbCka9hFOUgOSLZBB6MwSmGPox90p00EvoSJ1im';// test

     public static apiURL: string = 'https://markzil.com/app';  //Prod
     public static secureApiURL: string = 'https://markzil.com/app/secure';  // Prod 
    // public static apiURL: string = 'http://citylink-dev-alb-2-1695362832.ap-south-1.elb.amazonaws.com:85/app'  //UAT
    // public static secureApiURL: string ='http://citylink-dev-alb-2-1695362832.ap-south-1.elb.amazonaws.com:85/app/secure';  //UAT
    // public static apiURL:string="https://emanzo.com:85/app" // UAT-with-Doamin
    // public static apiURL: string = 'http://citylink-dev-alb-1-946524014.ap-south-1.elb.amazonaws.com:84/app';  //SIT
    // public static secureApiURL: string = 'http://citylink-dev-alb-1-946524014.ap-south-1.elb.amazonaws.com:84/app/secure';  //SIT   
    //  public static apiURL: string = 'http://localhost:8080';
    //    public static secureApiURL: string = 'http://localhost:8080/secure';
       
      //  public static serverApiURL: string = 'http://localhost:9000';
    // public static serverApiURL: string = 'http://citylink-dev-alb-2-1695362832.ap-south-1.elb.amazonaws.com:88/app'; //UAT SERVER
    public static serverApiURL: string = 'https://www.oauth.markzil.com:88/app'; //PROD SERVER

}
