import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from "@angular/common";
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';

@Component({
  selector: 'app-file-uploaded',
  templateUrl: './file-uploaded.component.html',
  styleUrls: ['./file-uploaded.component.css']
})
export class FileUploadedComponent implements OnInit {

  fileName: any;
  previewDatList: any = [];


  constructor(private router: Router, private location: Location, private previewService: PreviewService) { }

  ngOnInit(): void {
  
    if (this.previewService.getFileData != null && this.previewService.getFileData != undefined
      && this.previewService.getPreviewList!=null && this.previewService.getPreviewList!=undefined) {
        this.previewDatList = this.previewService.getPreviewList;
        this.fileName = this.previewService.getFileData.name; 
   } else {
     this.router.navigate(['/import-contact']);
   }
  }

  redirectToimportContact(){
    this.router.navigate(['/import-contact']);
  }

  redirectTofileDetails() {
    this.previewService.setFileData = this.previewService.getFileData;
    this.previewService.setPreviewList = this.previewService.getPreviewList;
    this.router.navigate(['/file-details']);
  }


}
