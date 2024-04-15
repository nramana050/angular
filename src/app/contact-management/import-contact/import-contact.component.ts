import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgForm, FormGroup } from '@angular/forms';
import { Location } from "@angular/common";
import Swal from 'sweetalert2';
import { ConatctServicesService } from '../contact-management-service/conatct-services.service';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
declare var $;

@Component({
  selector: 'app-import-contact',
  templateUrl: './import-contact.component.html',
  styleUrls: ['./import-contact.component.css']
})
export class ImportContactComponent implements OnInit {

  fileName: any;
  photoContent: any;
  fileExtension: any;
  fileExtensionError: boolean = false;
  fileExtensionMessage: any;
  photoForm: FormGroup;
  previewDatList: any = [];
  duplicatePreviewDatList: any = [];
  userInfo: any = {
    attribute: "",
  };
  uploadFile: any = [{ imageUpload: "", }]
  isShowDiv = false;
  //Template
  attri = ['FIRST_NAME', 'LAST_NAME', 'EMAIL_ID', 'MOBILE_NO', 'BIRTH_DATE', 'COMPANY_UNIQUE_ID', 'COMPANY_NAME', 'CITY'];

  userData: any = [];
  attSelection = "SKIP";
  mailIdSelection = false;

  constructor(private router: Router, private location: Location,
    private conatctServicesService: ConatctServicesService, private previewService: PreviewService) { }

  ngOnInit(): void {
  }

  imageFile() {
    let element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
    element.click();
  }


  fileEvent(event): any {
    //*-- this function gets content of uploaded file and validation --
    ///*--
    var file = event.target.files[0];
    this.fileName = file.name;

    var allowedExtensions =
      ["csv", "txt"];
    this.fileExtension = this.fileName.split('.').pop();

    if (this.isInArray(allowedExtensions, this.fileExtension)) {
      this.fileExtensionError = false;
      this.fileExtensionMessage = ""
    } else {
      this.fileExtensionMessage = "Only photos allowed!!"
      this.fileExtensionError = true;
    }

    if (file) {
      var reader = new FileReader();
      reader.onloadend = (e: any) => {
        var contents = e.target.result;
        this.photoContent = contents;
      }
      reader.readAsDataURL(file);
    } else {
      alert("Failed to load file");
    }

  }
  /*- checks if word exists in array -*/
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  // file upload 
  onSubmit() {
    let fileData = $('#fileUpload')[0].files[0];


    if (fileData != null && fileData != "" && fileData != undefined) {
      let totalBytes = $('#fileUpload')[0].files[0].size;
      let filesize = Number(totalBytes / 1000000);
      this.previewService.setFileData = fileData;

      const FileName = $('#fileUpload')[0].files[0].name;
      if (FileName.split(".")[1] == "xlsx" || FileName.split(".")[1] == "XLSX" || FileName.split(".")[1] == "csv" || FileName.split(".")[1] == "txt") {
        if (filesize <= 6) {
          let resp = this.conatctServicesService.uploadContactList(fileData, sessionStorage.getItem("customerId"));
          resp.subscribe((data) => {
            if (data != null) {
              this.previewDatList = data;
              this.isShowDiv = !this.isShowDiv;
              setTimeout(() => {
                this.autoMapping();
              }, 1000);
            } else {
              Swal.fire("We're unable to read this file!");
            }
          });
        } else {
          Swal.fire("File size should not greater than 6 MB !");
        }
      } else {
        Swal.fire("Selected file format must be 'xlsx' or '.csv' or '.txt'");
      }
    }

  }
  autoMapping() {
    let flg = 0;
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    for (let i in this.previewDatList) {
      for (let j in this.previewDatList[i].reviewFileList) {
        var email = this.previewDatList[i].reviewFileList[j].columnValue;
        if (regex.test(email)) {
          if (flg === 0) {
            var columIndex = this.previewDatList[i].reviewFileList[j].columnIndx;
            $('#attribute' + columIndex).val('EMAIL_ID');
            flg = 1;
          }
        }
      }
    }
  }
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

  checkDuplicationSelection(index) {
    let currentSelection = $('#attribute' + index).val();
    for (let h in this.previewDatList[0].reviewFileList) {
      if ($('#attribute' + h).val() != undefined && $('#attribute' + h).val() != null && $('#attribute' + h).val() != "" && $('#attribute' + h).val() != "SKIP" && $('#attribute' + h).val() != "null") {
        if (currentSelection === $('#attribute' + h).val() && index != h) {
          $('#attribute' + index).val('');
          Swal.fire("This attribute already mapped");
        }
      }
    }
  }



  redirectTofileUploaded() {
    let mapFLg = 1;
    let empty = 0;
    let emailIdSelection = 0;
    this.duplicatePreviewDatList = JSON.parse(JSON.stringify(this.previewDatList));
    for (let h in this.previewDatList[0].reviewFileList) {
      if ($('#attribute' + h).val() != undefined && $('#attribute' + h).val() != null && $('#attribute' + h).val() != "" && $('#attribute' + h).val() != "SKIP" && $('#attribute' + h).val() != "null") {
        this.previewDatList[0].reviewFileList[h].attribute = $('#attribute' + h).val();
        if ($('#attribute' + h).val() === "EMAIL_ID") {
          emailIdSelection = 1;
        }
        empty = 1;
      } else {
        if ($('#attribute' + h).val() != "SKIP" && this.previewDatList[0].reviewFileList[h].columnValue != null && this.previewDatList[0].reviewFileList[h].columnValue != '') {
          mapFLg = 0;
        }
        this.previewDatList[0].reviewFileList[h].attribute = null;
      }
    }

    if (mapFLg == 1) {
      if (empty == 1) {
        if (emailIdSelection == 1) {
          for (let k in this.duplicatePreviewDatList) {
            if (k !== '0') {
              for (let l in this.duplicatePreviewDatList[k].reviewFileList) {
                let temp = 0;
                for (let h in this.previewDatList[0].reviewFileList) {
                  if (Number(this.duplicatePreviewDatList[k].reviewFileList[l].columnIndx) === Number(this.previewDatList[0].reviewFileList[h].columnIndx) &&
                    this.previewDatList[0].reviewFileList[h].attribute != null &&
                    this.previewDatList[0].reviewFileList[h].attribute !== '' &&
                    this.previewDatList[0].reviewFileList[h].attribute !== ' ' &&
                    this.previewDatList[0].reviewFileList[h].attribute !== 'null') {
                    temp = 1;
                  }
                }
                if (temp === 0) {
                  this.previewDatList[k].reviewFileList[l] = null;
                }
              }
            }
          }

          this.previewService.setPreviewList = this.previewDatList;

          this.router.navigate(['/file-uploaded']);
        } else {
          Swal.fire("Please select EMAIL_ID attribute");
        }
      } else {
        Swal.fire("Please select atlest one column");
      }
    } else {
      Swal.fire("please select all attribute");
    }
  }

}
