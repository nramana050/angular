import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadCsvService } from '../upload-csv.service';

@Component({
  selector: 'app-opencsverrorpopup',
  templateUrl: './opencsverrorpopup.component.html',
  styleUrls: ['./opencsverrorpopup.component.scss']
})
export class OpencsverrorpopupComponent implements OnInit {

  csvError: [];
  userError: [];
  lowestToHighest: [];
  lowToHigh: any;
  
  constructor(
    private readonly uploadService:UploadCsvService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) 
  { } 

  ngOnInit(): void {
    this.csvError=this.data.CSV_ERROR;
    this.csvError?.sort((a, b) => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
    this.userError=this.data.USER_CREATION_ERROR;
    this.userError?.sort((a, b) => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
  }

}
