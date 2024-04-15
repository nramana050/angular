import { Component, HostListener, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgForm, FormGroup } from '@angular/forms';
import { Location, DatePipe } from "@angular/common";
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ConatctServicesService } from '../contact-management-service/conatct-services.service';
import Swal from 'sweetalert2';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
import { OrderPipe } from 'ngx-order-pipe';
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

declare var $;
@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.css']
})
export class CreateListComponent implements OnInit {
  @ViewChild('closenewListModal') closenewListModal: ElementRef;
  submitFlg = false;
  search;
  chkName = '1';
  private term: string = "";
  i;
  customerClientList: any = {};
  downloadCustomerData: any = [];

  statisticsdownloadList: any = {};
  statisticsdownloadData: any = [];
  statasticLoader = true;
  //Pagination
  p = 1;
  showData = {
    //rows Per Page
    rowsPerPage: 5
  };

  // Table aray

  itrationCount = 1;
  btnName = "Create an Empty List";
  headName = "Contact Management > Create List";
  editMode = false;
  listData = [];
  OriginlistData = [];
  form: FormGroup
  duplicateArray: any = [];
  selectedallContactList: any = [];

  //date filter
  dobflag1 = false;
  dobflag2 = false;
  dateFilterFlg = false;
  min1: string;
  min2: string;
  editflg = false;
  processDetails = [];

  formData = {
    startDate: "",
    endDate: ""
  };

  submitted = false;
  listInfo: any = {
    listDescription: "",
    listName: "",
  };
  dashboardListInternalList: any[];
  customerClientIdList: any;
  groupData: any;
  campaignRouting: any;
  order: string = 'listId';
  reverse: boolean = true;
  hideCancleBtn = false;
  activedeactive;
  nodataFlg = false;
  campProcessData: any;
  campProcessRouting: any = [];
  name = 'valid'

  statastic: any = {
    'valide': 0,
    'invalide': 0,
    'domainvalide': 0,
    'totalValidation': 0
  }
  valid = false;
  invalid = false;
  Unknown = false;

  @HostListener('window:scroll')
  checkScroll() {

    // window의 scroll top
    // Both window.pageYOffset and document.documentElement.scrollTop returns the same result in all the cases. window.pageYOffset is not supported below IE 9.

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  constructor(public datepipe: DatePipe, private router: Router, private location: Location, private fb: FormBuilder, private previewService: PreviewService, private conatctServicesService: ConatctServicesService, private orderPipe: OrderPipe) {
    this.createForm();
    this.groupData = this.organise(this.downloadCustomerData);
    // Campdshboared Routing from create camp +

    if (this.previewService.campaignRouting != null && this.previewService.campaignRouting != undefined && this.previewService.campaignRouting != "" && this.previewService.selectedCampaignIdListRouting != null && this.previewService.selectedroutingList != null) {
      this.campaignRouting = this.previewService.campaignRouting;
      this.hideCancleBtn = true;
      this.campProcessData = this.previewService.selectedCampaignIdListRouting;
      this.campProcessRouting = this.previewService.selectedroutingList;
    } else {
      this.hideCancleBtn = false;
    }
  }
  ngOnInit(): void {
    this.getAllListDetails();
    this.activedeactive = 1;
    // this.activeDeactive();
    this.minAgeFrom();

  }



  redirectToaddContact() {
    this.router.navigate(['/add-contact']);
  }

  redirectToImportContact() {
    this.router.navigate(['/import-contact']);
  }

  redirectToAllContacts(i, listId, contactCount) {
    this.selectedallContactList = [];
    // console.log(listId);
    
    if (contactCount != null && contactCount != "" && contactCount != "0" && contactCount != 0) {
      for (let i in this.duplicateArray) {
        if (this.duplicateArray[i].listId == listId) {
          this.duplicateArray[i].listId = sessionStorage.setItem("listId", this.duplicateArray[i].listId);
          this.duplicateArray[i].listName = sessionStorage.setItem("listName", this.duplicateArray[i].listName);
          this.selectedallContactList.contactCount = this.duplicateArray[i].contactCount;
          this.selectedallContactList = this.duplicateArray[i];
        }
      }
      if (this.selectedallContactList.contactCount != "0") {
        this.previewService.selectedallContactList = this.selectedallContactList;
        this.router.navigate(['/all-contacts']);
      } else {
        // this.getAllListDetails();    
        Swal.fire("This list have 0 contacts");
      }
    } else {
      Swal.fire("This list have 0 contacts");
    }
  }


  onSubmit() { this.submitted = true; }

  createForm() {
    this.form = this.fb.group({
      dateTo: ['', Validators.required],
      dateFrom: ['', Validators.required]
    }, { validator: this.dateLessThan('dateFrom', 'dateTo') });
  }

  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "Start date should be less than end date"
        };
      }
      return {};
    }
  }



  //Date filter

  reverseAndTimeStamp(dateString) {
    let d1 = this.datepipe.transform(dateString, "yyyy-MM-dd");
    return d1;
  }


  filterDate() {
    this.duplicateArray = [];

    this.dateValid1();
    this.dateValid2();

    let fr = this.datepipe.transform(this.formData.startDate, "yyyy-MM-ddThh:mm");
    let to = this.datepipe.transform(this.formData.endDate, "yyyy-MM-ddThh:mm");

    if (this.formData.startDate != null && this.formData.startDate != undefined && this.formData.startDate != ""
      && this.formData.endDate != null && this.formData.endDate != undefined && this.formData.endDate != "") {
      this.dateFilterFlg = true;
      let selectedMembers = this.listData.filter(f =>
        new Date(this.reverseAndTimeStamp(f.createdDate)) >= new Date(this.formData.startDate)
        && new Date(this.reverseAndTimeStamp(f.createdDate)) <= new Date(this.formData.endDate));
      this.duplicateArray = selectedMembers;
    }
    else {
      this.duplicateArray = this.listData;
    }
  }

  minAgeFrom() {
    let today = new Date();
    var tod = moment(today).format("DD-MM-YYYY");
    let temp = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.min2 = moment(temp).format("YYYY-MM-DD");
  }

  reset() {
    this.formData.startDate = "";
    this.formData.endDate = "";
    this.duplicateArray = this.listData;
    this.dobflag1 = false;
    this.dobflag2 = false;
  }

  dateValid1() {
    if (this.formData.startDate == null || this.formData.startDate == undefined || this.formData.startDate == "") {
      this.dobflag1 = true;
    } else {
      this.dobflag1 = false;
    }
  }

  dateValid2() {
    if (this.formData.endDate == null || this.formData.endDate == undefined || this.formData.endDate == "") {
      this.dobflag2 = true;
    } else {
      this.dobflag2 = false;
    }
  }

  //End date filter

  editList(data) {
    this.editMode = true;
    this.btnName = "Update";
    this.headName = "Contact Management > Edit List"
    this.listInfo = JSON.parse(JSON.stringify(data))
  }

  getDeleted() {
    this.listData = [];
    this.duplicateArray = [];
    // if ($("#deleted").is(":checked")) {
    //   this.chkName = "0"
    // } else {
    //   this.chkName = "1"
    // }

    this.chkName = this.activedeactive;
    for (let i in this.OriginlistData) {
      if (this.OriginlistData[i].status == this.chkName) {
        this.listData.push(this.OriginlistData[i]);
        this.duplicateArray.push(this.OriginlistData[i]);
      }
    }

  }

  checkDuplicateList() {

    let resp = this.conatctServicesService.checkDuplicateList(this.listInfo.listName, sessionStorage.getItem('customerId'));
    resp.subscribe(data => {

      if (data == '1' || data == 1) {
        Swal.fire("List name already available!");
        this.listInfo.listName = "";
      }
    });
  }

  // NEW CHNAGES



  getVerificationStatistic(listId, listName) {
    this.statasticLoader = true;
    this.statastic.valid = 0;
    this.statastic.listId = 0;
    this.statastic.invalide = 0;
    this.statastic.domainvalide = 0;
    this.statastic.totalValidation = 0;
    let resp = this.conatctServicesService.getVerificationStatistic(sessionStorage.getItem('customerId'), listId);
    resp.subscribe(data => {
      if (data != null && data != '' && data.length != 0) {
        this.statastic.invalide = data[0];
        this.statastic.valid = data[1];
        this.statastic.domainvalide = data[2];
        this.statastic.listId = listId;
        this.statastic.listName = listName;
        this.statastic.totalValidation = Number(data[0]) + Number(data[1]) + Number(data[2]);
        this.statasticLoader = false;
        // checkbox cheked
        if (this.statastic.domainvalide != 0) {
          this.Unknown = true;
        }
        if (this.statastic.valid != 0) {
          this.valid = true;
        }
        if (this.statastic.invalide != 0) {
          this.invalid = false;
        }
      }
    });
  }

  //
  deleteStatastics(listId) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let resp = this.conatctServicesService.removeFromVerification(sessionStorage.getItem('customerId'), listId);
        resp.subscribe(data => {
          if (data != null && data != '' && data == 1 || data == '1') {
            this.closenewListModal.nativeElement.click();
            document.getElementById('myModal').click();
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
            this.getAllListDetails();
          }
        });
      }
    })
  }


  uploadVerificationContact(listId) {
    if (this.valid != false || this.invalid != false || this.Unknown != false) {

      let msg = '';
      let BtnMsg = '';
      msg = "You want to upload this list!";
      BtnMsg = "upload";

      Swal.fire({
        title: 'Are You Sure?',
        text: msg,
        footer: 'Once uploaded this statistics pop-up will never appear again',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, ' + BtnMsg + ' it!'
      }).then((result) => {
        if (result.isConfirmed) {

          let resp = this.conatctServicesService.uploadVerificationContact(sessionStorage.getItem('customerId'), listId, this.valid, this.invalid, this.Unknown);
          resp.subscribe(data => {
            if (data != null && data != '') {
              this.closenewListModal.nativeElement.click();
              document.getElementById('myModal').click();
            }
          });
          Swal.fire({
            position: 'center',
            title: 'Contact uploading is in progress',
          }).then(okay => {
            if (okay) {
              this.getAllListDetails();
            }
          });
        }

      })
    } else {
      Swal.fire("Please select atleast one of the checkbox!")
    }

  } 

  downloadVStatasticsFile(listId, listName, totalValidation) {
    this.statisticsdownloadList = {};
    this.statisticsdownloadData = [];

    this.itrationCount = 1;
    let startNo = 0;
    let size = 500;
    let count = Number(totalValidation);
    let itration = Math.ceil(count / size);
    for (var i = 0; i <= itration; i++) {
      this.itrationCount++;
      if (i != 0) {
        startNo = size + startNo;
      }
      let resp = this.conatctServicesService.downLoadStatistic(sessionStorage.getItem("customerId"), listId, startNo, size);
      resp.subscribe(data => {
        this.itrationCount--;
        if (data != null && data != "") {
          for (let i in data) {
            this.statisticsdownloadList = {};
            this.statisticsdownloadList.First_Name = data[i].firstName;
            this.statisticsdownloadList.Last_Name = data[i].lastName;
            this.statisticsdownloadList.Email_Id = data[i].originalEmailId;
            this.statisticsdownloadList.Company_Name = data[i].companyName;
            if (data[i].dob != null && data[i].dob != "" && data[i].dob != undefined) {
              this.customerClientList.Date_of_birth = moment(data[i].dob).format('YYYY-MM-DD');
            } else {
              this.customerClientList.Date_of_birth = "";
            }
            this.statisticsdownloadList.Company_Unique_Id = data[i].companyUniqueId;
            this.statisticsdownloadList.City = data[i].city;
            if (data[i].mobileCountryCode != null && data[i].mobileCountryCode != "" && data[i].mobileCountryCode != undefined) {
              this.statisticsdownloadList.Mobile_Country_Code = data[i].mobileCountryCode;
            } else {
              this.statisticsdownloadList.Mobile_Country_Code = "";
            }
            if (data[i].mobileNo != null && data[i].mobileNo != "" && data[i].mobileNo != undefined) {
              this.statisticsdownloadList.Mobile_Number = data[i].mobileNo;
            } else {
              this.statisticsdownloadList.Mobile_Number = "";
            }

            if (data[i].verifiation == "0") {
              this.statisticsdownloadList.Verifiation_Status = "Invalid";
            } else if (data[i].verifiation == "1") {
              this.statisticsdownloadList.Verifiation_Status = "Valid";
            } else if (data[i].verifiation == "2") {
              this.statisticsdownloadList.Verifiation_Status = "Unknown";
            }

            this.statisticsdownloadData.push(this.statisticsdownloadList);
          }
        }
        if (this.itrationCount == 1) {

          this.conatctServicesService.exportAsExcelFile(this.statisticsdownloadData, listName);
        }
      });

    }
  }




  //
  getAllListDetails() {
    this.OriginlistData = [];
    this.duplicateArray = [];
    this.nodataFlg = false;

    let resp = this.conatctServicesService.getAllListDetails(sessionStorage.getItem('customerId'));
    resp.subscribe(data => {
      if (data != null && data != '' && data.length != 0) {
        this.OriginlistData = [];
        for (let i in data) {
          data[i].itrationCount = null;
          data[i].downloadData = [];
          this.OriginlistData.push(data[i]);
        }
      } else {
        this.nodataFlg = true;
      }
      this.getDeleted();
    });
  }

  // form submit 
  saveUser(createList: NgForm) {
    this.listInfo.customerId = sessionStorage.getItem('customerId');
    this.saveListDetails(JSON.parse(JSON.stringify(this.listInfo)));
    createList.resetForm();
  }

  saveListDetails(listInfo) {  
    var flg = 0;
    let resp = this.conatctServicesService.checkDuplicateList(listInfo.listName, sessionStorage.getItem('customerId'));
    resp.subscribe(data => {
      if (data == '1' || data == 1) {
        flg = 0;
        if(this.editMode==true){
          flg = 1;
        }
      } else {
        flg = 1;
      }
      if(flg==1){
        this.submitFlg = true;
        let resp = this.conatctServicesService.createList(listInfo);
        resp.subscribe(data => {
          if (data != null || data != 0 || data != '0') {
            this.submitFlg = false;
            if (this.editMode == false) {
              Toast.fire({
                icon: 'success',
                title: 'New list added succesfully'
              })
            }
            else {
              Toast.fire({
                icon: 'success',
                title: ' List updated succesfully '
              })
            }
            this.getAllListDetails();
            // this.activeDeactive();
            if (this.campaignRouting == "campDashboard") {
              this.previewService.selectedCampaignIdListRouting = this.campProcessData;
              this.previewService.selectedroutingList = this.campProcessRouting;
              this.router.navigate(['/create-campaign']);
            }
            this.clear();
          }
        });
        }
  });
  }


  redirecttoCampain() {
    if (this.campaignRouting == "campDashboard") {
      this.previewService.selectedCampaignIdListRouting = this.campProcessData;
      this.previewService.selectedroutingList = this.campProcessRouting;
      this.router.navigate(['/create-campaign']);
    } else {
      this.cancelClear();
    }
  }




  deleteList(list) {
    this.cancelClear();

    list = JSON.parse(JSON.stringify(list));
    let msg = '';
    let BtnMsg = '';
    if (list.status == '1') {
      list.status = '0';
      msg = "You want to set this list as In-active!";
      BtnMsg = "In-active";
    } else {
      msg = "You want to set this list as active!";
      list.status = '1';
      BtnMsg = "Active";
    }
    Swal.fire({
      title: 'Are you sure?',
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, ' + BtnMsg + ' it!'
    }).then((result) => {
      if (result.isConfirmed) {
        list.customerId = sessionStorage.getItem('customerId');
        let resp = this.conatctServicesService.createList(list);
        resp.subscribe(data => {
          // this.activeDeactive();
          this.getAllListDetails();
        });
        if (list.status == '1') {
          Swal.fire(
            'Active!',
            'This list has been set as active',
            'success'
          )
          this.reset();
        } else {
          Swal.fire(
            'In-Active!',
            'This list has been set as In-active',
            'success'
          )
          this.reset();
        }
        //this.saveListDetails(list);

      }
    })
  }

  clear() {
    this.editMode = false;
    this.listInfo.listDescription = "";
    this.listInfo.listName = "";
    this.listInfo.listId = "";
    this.listInfo.listSkey = "";
    this.btnName = "Create an Empty List";
    this.headName = "Contact Management > Create List";
  }

  cancelClear() {
    this.editMode = false;
    this.listInfo.listDescription = "";
    this.listInfo.listName = "";
    this.listInfo.listSkey = "";
    this.listInfo.listId = "";
    this.btnName = "Create an Empty List";
    this.headName = "Contact Management > Create List";
  }

  collectAllDownloadData(i, listId) {
    this.selectedallContactList = [];
    for (let i in this.duplicateArray) {
      if (this.duplicateArray[i].listId == listId) {
        // this.duplicateArray[i].listId = sessionStorage.setItem("listId", this.duplicateArray[i].listId);
        //this.duplicateArray[i].listName = sessionStorage.setItem("listName", this.duplicateArray[i].listName);
        this.selectedallContactList.contactCount = this.duplicateArray[i].contactCount;
        this.selectedallContactList = this.duplicateArray[i];
      }
    }
    if (this.selectedallContactList.contactCount != '0' && this.selectedallContactList.contactCount != null &&
      this.selectedallContactList.contactCount != undefined) {
      this.download(listId, this.selectedallContactList.contactCount);
    }
    else {
      Swal.fire("This list is empty!");
    }
    // this.getAllListDetails();
  }


  setItrationCount(listId, count) {
    for (let i in this.duplicateArray) {
      if (this.duplicateArray[i].listId == listId) {
        this.duplicateArray[i].itrationCount = count + 0;
      }
    }
  }

  setPlausItrationCount(listId) {
    for (let i in this.duplicateArray) {
      if (this.duplicateArray[i].listId == listId) {
        this.duplicateArray[i].itrationCount = Number(this.duplicateArray[i].itrationCount) + 1;
      }
    }
  }
  setMinsItrationCount(listId) {
    for (let i in this.duplicateArray) {
      if (this.duplicateArray[i].listId == listId) {
        if (this.duplicateArray[i].itrationCount != 1) {
          this.duplicateArray[i].itrationCount = Number(this.duplicateArray[i].itrationCount) - 1;
        }
      }
    }
  }

  pushDataForDownload(listId, info) {
    for (let i in this.duplicateArray) {
      if (this.duplicateArray[i].listId == listId) {
        this.duplicateArray[i].downloadData.push(info);
      }
    }
  }

  downloadFile(listId) {
    for (let i in this.duplicateArray) {
      if (this.duplicateArray[i].listId == listId) {
        if (this.duplicateArray[i].itrationCount == 1) {
          this.conatctServicesService.exportAsExcelFile(this.duplicateArray[i].downloadData, this.duplicateArray[i].listName);
          this.duplicateArray[i].downloadData = [];
        }
      }
    }
  }

  download(listId, contactCount): void {
    this.customerClientIdList = [];
    this.customerClientList = [];
    this.downloadCustomerData = [];

    this.setItrationCount(listId, 1);

    this.itrationCount = 1;
    let startNo = 0;
    let size = 500;
    let count = Number(contactCount);
    let itration = Math.ceil(count / size);
    for (var i = 0; i <= itration; i++) {
      this.setPlausItrationCount(listId);
      this.itrationCount++;
      if (i != 0) {
        startNo = size + startNo;
      }
      let resp = this.conatctServicesService.fetchAllContacts(startNo, size, listId, sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        if (data != null) {
          if (data[0].customerId != null && data[0].customerId != "") {
            this.itrationCount--;
            this.setMinsItrationCount(data[0].listId);
            this.customerClientIdList = data;
            for (let i in this.customerClientIdList) {
              this.customerClientList = {};
              this.customerClientList.First_Name = this.customerClientIdList[i].customerClient.firstName;
              this.customerClientList.Last_Name = this.customerClientIdList[i].customerClient.lastName;
              this.customerClientList.Email_Id = this.customerClientIdList[i].customerClient.originalEmailId;
              if (this.customerClientIdList[i].customerClient.mobileCountryCode != null) {
                this.customerClientList.Country_Code = this.customerClientIdList[i].customerClient.mobileCountryCode;
              }
              else {
                this.customerClientList.Country_Code = "";
              }
              if (this.customerClientIdList[i].customerClient.mobileNo != null) {
                this.customerClientList.Mobile_No = this.customerClientIdList[i].customerClient.mobileNo;
              }
              else {
                this.customerClientList.Mobile_No = "";
              }
              if (this.customerClientIdList[i].customerClient.dob != null) {
                this.customerClientList.Date_of_birth = moment(this.customerClientIdList[i].customerClient.dob).format('YYYY-MM-DD');
              }
              else {
                this.customerClientList.Date_of_birth = null;
              }
              if (this.customerClientIdList[i].customerClient.city != null) {
                this.customerClientList.City = this.customerClientIdList[i].customerClient.city;
              }
              else {
                this.customerClientList.City = "";
              }
              if (this.customerClientIdList[i].customerClient.companyName != null) {
                this.customerClientList.Company_Name = this.customerClientIdList[i].customerClient.companyName;
              }
              else {
                this.customerClientList.Company_Name = "";
              }
              if (this.customerClientIdList[i].customerClient.blacklist == "1") {
                this.customerClientList.Blacklist = this.customerClientIdList[i].customerClient.blacklist;
                this.customerClientList.Blacklist = "Y"
              }
              else {
                this.customerClientList.Blacklist = "N";
              }
              if (this.customerClientIdList[i].customerClient.archive == "1") {
                this.customerClientList.Archive = this.customerClientIdList[i].customerClient.archive;
                this.customerClientList.Archive = "Y"
              }
              else {
                this.customerClientList.Archive = "N";
              }
              if (this.customerClientIdList[i].customerClient.unsubscribed == "1") {
                this.customerClientList.Unsubscribed = this.customerClientIdList[i].customerClient.unsubscribed;
                this.customerClientList.Unsubscribed = "Y"
              }
              else {
                this.customerClientList.Unsubscribed = "N";
              }
              // this.downloadCustomerData.push(this.customerClientList);
              this.pushDataForDownload(data[0].listId, this.customerClientList);
            }
            //  if (this.itrationCount == 1) {
            //     this.conatctServicesService.exportAsExcelFile(this.downloadCustomerData, sessionStorage.getItem("listName"));
            //  }
            this.downloadFile(data[0].listId);
          } else {
            this.setMinsItrationCount(data[0].listId);
            this.downloadFile(data[0].listId);
          }
        }
      });
    }

  }

  organise(arr) {
    var headers = [], // an Array to let us lookup indicies by group
      objs = [],    // the Object we want to create
      i, j;
    for (i = 0; i < arr.length; ++i) {
      j = headers.indexOf(arr[i].id); // lookup
      if (j === -1) { // this entry does not exist yet, init
        j = headers.length;
        headers[j] = arr[i].id;
        objs[j] = {};
        objs[j].id = arr[i].id;
        objs[j].this.downloadCustomerData = [];
      }
      objs[j].this.downloadCustomerData;
    }
    return objs;
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  refresh() {
    this.listData = [];
    this.duplicateArray = [];
    this.getAllListDetails();
  }

  // activeDeactive() {
  //   console.log(this.activedeactive);
  //   this.nodataFlg=false;
  //   if (this.activedeactive == 1) {
  //     let resp = this.conatctServicesService.getAllListDetails(sessionStorage.getItem("customerId"));
  //     resp.subscribe(data => {
  //       this.OriginlistData = [];
  //       this.duplicateArray =[];
  //       if (data != 0 && data!="") {
  //         for (let i in data) {
  //           data[i].itrationCount = null;
  //           data[i].downloadData = [];
  //           if (data[i].status == '1') {
  //             this.duplicateArray.push(data[i]);
  //           }
  //         }
  //       }else{
  //         this.nodataFlg=true;
  //       }
  //     });
  //   }
  //   if (this.activedeactive == 2) {
  //     let resp = this.conatctServicesService.getAllListDetails(sessionStorage.getItem("customerId"));
  //     resp.subscribe(data => {
  //       this.OriginlistData = [];
  //       this.duplicateArray =[];
  //       if (data != 0 && data!="") {
  //         for (let i in data) {
  //           data[i].itrationCount = null;
  //           data[i].downloadData = [];
  //           if (data[i].status == '0') {
  //             this.duplicateArray.push(data[i]);
  //           }
  //         }
  //       }else{
  //         this.nodataFlg=true;
  //       }
  //     });
  //   }

  // }

}
