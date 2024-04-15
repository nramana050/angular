import { Component, OnInit } from '@angular/core';
import { ProfileServicesService } from 'src/app/profile-management/profile-services/profile-services.service';
import { Router } from '@angular/router';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
import Swal from 'sweetalert2';
import { ConatctServicesService } from 'src/app/contact-management/contact-management-service/conatct-services.service';
import * as moment from 'moment';
declare var $: any
@Component({
  selector: 'app-countall-contact',
  templateUrl: './countall-contact.component.html',
  styleUrls: ['./countall-contact.component.css']
})
export class CountallContactComponent implements OnInit {
  //Select all checkbox

  search;
  private term: string = "";


  //Pagination
  p = 1;
  showData: any = {
    rowsPerPage: 5
  };
  filterFlg = "";

  // Select filter 
  pageTitile = "Contact Details";
  activedeactive;
  selectFilter = null;
  filter = ['.CSV', '.XLSX / .XLS'];
  allContactData: any = [];
  countViewList: any = [];
  OrigincountViewList: any = [];
  countclkId: string;
  selectedRow: Number;
  checkboxes: boolean[];
  blackList: any = [];
  blacklistflag: any;
  customerClientList: any = [];
  downloadCustomerData: any = [];
  alldownloadableData: any = [];
  groupData: any;
  countallData: any = {};
  archiveCamp: any = {};
  archiveList: any[];
  dataloadingFlg = 0;
  dashBoradCount = 0;
  deletecontactList: any = [];
  deletecontact: any = {};


  itrationCount = null;

  constructor(private router: Router, private profileServicesService: ProfileServicesService, private previewService: PreviewService, private conatctServicesService: ConatctServicesService) {
    this.groupData = this.organise(this.downloadCustomerData);

  }

  ngOnInit(): void {
    this.countclkId = sessionStorage.getItem("countClickId");
    this.dashBoradCount = Number(sessionStorage.getItem("dashBoradCount"));
    if (this.countclkId != null && this.countclkId != undefined && this.countclkId != "") {
      if (this.countclkId == "allcount") {
        this.pageTitile = "All Contact Details";
        // this.getdashboardAllContact();
        this.allContactPagination();
      } else if (this.countclkId == "opencount") {
        this.pageTitile = "Open Contact Details";
        this.getdashboardOpenContact();
      } else if (this.countclkId == "clickCount") {
        this.pageTitile = "Click Contact Details";
        this.getdashboardClickContact();
      } else if (this.countclkId == "blackcount") {
        this.pageTitile = "Blacklisted Contact Details";
        this.getdashboardBlacklistedContact();
      } else if (this.countclkId == "hardbounce") {
        this.pageTitile = "Hard Bounce Contact Details";
        this.getdashboardhardBounceContact();
      }
    } else {
      this.router.navigate(['/dashboard']);
    }
    this.activedeactive = 0;

  }


  setClickedRow(index) {
    this.selectedRow = index;
  }

  selectAll() {
    if ($("#allcheck").is(":checked")) {
      for (let i in this.countViewList) {

        $("#check_" + this.countViewList[i].customerClientId).prop("checked", true);
      }
    } else {
      for (let i in this.countViewList) {
        $("#check_" + this.countViewList[i].customerClientId).prop("checked", false);
      }
    }
  }

  toggleSelection(event, i) {
    // this.checkboxes[i] = event.target.checked;
  }

  // all count using spirng pagination
  allContactPagination() {
    this.countViewList = [];
    this.OrigincountViewList = [];
    this.alldownloadableData = [];
    let startNo = 0;
    let size = 500;
    this.itrationCount = 1;
    let count = Number(this.dashBoradCount);
    let itration = Math.ceil(count / size);
    for (var i = 0; i <= itration; i++) {
      this.itrationCount++;
      if (i != 0) {
        startNo = size + startNo;
      }
      let resp = this.profileServicesService.getPaginationdashboardAllContact(startNo, size, sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        this.itrationCount--;
        if (data != null && data != "") {
          for (let i in data) {
            this.alldownloadableData.push(data[i]);
            this.countallData = {};
            // if (data[i].archive != '1' && data[i].blacklist != '1') {
            this.countallData.originalEmailId = data[i].originalEmailId;
            this.countallData.customerClientId = data[i].customerClientId;
            this.countallData.listClientMapSkey = data[i].listClientMapSkey;
            this.countallData.firstName = data[i].firstName;
            this.countallData.lastName = data[i].lastName;
            this.countallData.mobileNo = data[i].mobileNo;
            this.countallData.dob = data[i].dob;
            this.countallData.blacklist = data[i].blacklist;
            this.countallData.archive = data[i].archive;
            this.countallData.unsubscribed = data[i].unsubscribed;
            this.countallData.listId = data[i].listId;
            this.countViewList.push(JSON.parse(JSON.stringify(this.countallData)));
            this.OrigincountViewList.push(JSON.parse(JSON.stringify(this.countallData)));
            // }
          }
        }
      });
    }

  }

  // all count
  // getdashboardAllContact() {
  //   this.countViewList = [];
  //   this.alldownloadableData = [];
  //   var firstId = 0;
  //   var lastId = 0;
  //   var Total = 0;
  //   this.itrationCount = 0;
  //   let resp1 = this.profileServicesService.getMapMaxAndMin(sessionStorage.getItem("customerId"))
  //   resp1.subscribe(data => {
  //     if (data != null && data != "") {
  //       this.itrationCount = 1;
  //       firstId = data[0].listClientMapId;
  //       lastId = firstId;
  //       Total = data[1].listClientMapId;
  //       for (var i = 0; firstId <= Total; firstId = lastId + 1) {
  //         lastId = lastId + 500;
  //         this.itrationCount++;
  //         let resp = this.profileServicesService.getdashboardAllContact(firstId, lastId, sessionStorage.getItem("customerId"));
  //         resp.subscribe(data => {
  //           this.itrationCount--;
  //           if (data != null && data != "") {

  //             for (let i in data) {
  //               this.alldownloadableData.push(data[i]);
  //               this.countallData = {};
  //               if (data[i].archive != '1' && data[i].blacklist != '1') {
  //                 this.countallData.originalEmailId = data[i].customerClient.originalEmailId;
  //                 this.countallData.customerClientId = data[i].customerClient.customerClientId;
  //                 this.countallData.listClientMapSkey = data[i].listClientMapSkey;
  //                 this.countallData.firstName = data[i].customerClient.firstName;
  //                 this.countallData.lastName = data[i].customerClient.lastName;
  //                 this.countallData.mobileNo = data[i].customerClient.mobileNo;
  //                 this.countallData.dob = data[i].customerClient.dob;
  //                 this.countallData.listId = data[i].listId;
  //                 this.countViewList.push(JSON.parse(JSON.stringify(this.countallData)));
  //               }

  //             }

  //           }
  //         });
  //       }
  //     }
  //   });
  // }

  loadingMessage() {
    Swal.fire("Please wait while data loading...!");
  }

  filterData() {
    this.countViewList = [];
    for (let i in this.OrigincountViewList) {
      if (this.filterFlg === "Blacklist" &&
        this.OrigincountViewList[i].blacklist == '1') {
        this.countViewList.push(this.OrigincountViewList[i]);
      } else if (this.filterFlg === "Archive" &&
        this.OrigincountViewList[i].archive == '1') {
        this.countViewList.push(this.OrigincountViewList[i]);
      } else if (this.filterFlg === "Unsubscribe" &&
        this.OrigincountViewList[i].unsubscribed == '1') {
        this.countViewList.push(this.OrigincountViewList[i]);
      }
      if (this.filterFlg === "" || this.filterFlg === " ") {
        this.countViewList.push(this.OrigincountViewList[i]);
      }
    }
  }

  // open count
  getdashboardOpenContact() {
    this.countViewList = [];
    this.OrigincountViewList = [];
    this.alldownloadableData = [];

    let startNo = 0;
    let size = 500;
    this.itrationCount = 1;
    let count = Number(this.dashBoradCount);
    let itration = Math.ceil(count / size);
    for (var i = 0; i < itration; i++) {
      this.itrationCount++;
      if (i != 0) {
        startNo = size + startNo;
      }
      let resp = this.profileServicesService.getdashboardOpenContact(startNo, size, sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        this.itrationCount--;
        if (data != null && data != "") {
          for (let i in data) {
            this.alldownloadableData.push(data[i]);
            this.countallData = {};
            if (data[i].archive != '1' && data[i].blacklist != '1') {
              this.countallData.originalEmailId = data[i].customerClient.originalEmailId;
              this.countallData.customerClientId = data[i].customerClient.customerClientId;
              this.countallData.firstName = data[i].customerClient.firstName;
              this.countallData.lastName = data[i].customerClient.lastName;
              this.countallData.mobileNo = data[i].customerClient.mobileNo;
              this.countallData.dob = data[i].customerClient.dob;
              this.countViewList.push(JSON.parse(JSON.stringify(this.countallData)));
              this.OrigincountViewList.push(JSON.parse(JSON.stringify(this.countallData)));
            }
          }
        }
      });
    }
  }

  // open count
  getdashboardClickContact() {
    this.countViewList = [];
    this.OrigincountViewList = [];
    this.alldownloadableData = [];
    this.itrationCount = 1;
    let startNo = 0;
    let size = 500;
    let count = Number(this.dashBoradCount);
    let itration = Math.ceil(count / size);
    for (var i = 0; i < itration; i++) {
      this.itrationCount++;
      if (i != 0) {
        startNo = size + startNo;
      }
      let resp = this.profileServicesService.getdashboardClickContact(startNo, size, sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        this.itrationCount--;
        if (data != null && data != "") {
          for (let i in data) {
            this.alldownloadableData.push(data[i]);
            this.countallData = {};
            if (data[i].archive != '1' && data[i].blacklist != '1') {

              this.countallData.originalEmailId = data[i].customerClient.originalEmailId;
              this.countallData.customerClientId = data[i].customerClient.customerClientId;
              this.countallData.firstName = data[i].customerClient.firstName;
              this.countallData.lastName = data[i].customerClient.lastName;
              this.countallData.mobileNo = data[i].customerClient.mobileNo;
              this.countallData.dob = data[i].customerClient.dob;
              this.countViewList.push(JSON.parse(JSON.stringify(this.countallData)));
              this.OrigincountViewList.push(JSON.parse(JSON.stringify(this.countallData)));
            }

          }

        }
      });
    }
  }

  // blacklisted count view
  getdashboardBlacklistedContact() {
    this.countViewList = [];
    this.OrigincountViewList = [];
    this.alldownloadableData = [];

    this.itrationCount = 1;
    let startNo = 0;
    let size = 500;
    let count = Number(this.dashBoradCount);
    let itration = Math.ceil(count / size);
    for (var i = 0; i < itration; i++) {
      this.itrationCount++;
      if (i != 0) {
        startNo = size + startNo;
      }
      let resp = this.profileServicesService.getdashboardBlacklistedContact(startNo, size, sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        this.itrationCount--;
        if (data != null && data != "") {

          for (let i in data) {
            this.alldownloadableData.push(data[i]);
            this.countallData = {};
            if (data[i].blacklist == '1') {
              this.countallData.originalEmailId = data[i].originalEmailId;
              this.countallData.customerClientId = data[i].customerClientId;
              this.countallData.firstName = data[i].firstName;
              this.countallData.lastName = data[i].lastName;
              this.countallData.mobileNo = data[i].mobileNo;
              this.countallData.dob = data[i].dob;
              this.countallData.blacklist = data[i].blacklist;
              this.countallData.archive = data[i].archive;
              this.countallData.unsubscribed = data[i].unsubscribed;
              this.countViewList.push(JSON.parse(JSON.stringify(this.countallData)));
              this.OrigincountViewList.push(JSON.parse(JSON.stringify(this.countallData)));
            }

          }

        }
      })
    }
  }


  // hard bounce  



  // blacklisted count view
  getdashboardhardBounceContact() {
    this.countViewList = [];
    this.OrigincountViewList = [];
    this.alldownloadableData = [];

    let startNo = 0;
    this.itrationCount = 1;
    let size = 500;
    let count = Number(this.dashBoradCount);
    let itration = Math.ceil(count / size);
    for (var i = 0; i < itration; i++) {
      this.itrationCount++;
      if (i != 0) {
        startNo = size + startNo;
      }
      let resp = this.profileServicesService.getdashboardhardBounceContact(startNo, size, sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        this.itrationCount--;
        if (data != null && data != "") {
          for (let i in data) {
            this.alldownloadableData.push(data[i]);
            this.countallData = {};
            if (data[i].archive != '1' && data[i].blacklist != '1') {

              this.countallData.originalEmailId = data[i].customerClient.originalEmailId;
              this.countallData.customerClientId = data[i].customerClient.customerClientId;
              this.countallData.firstName = data[i].customerClient.firstName;
              this.countallData.lastName = data[i].customerClient.lastName;
              this.countallData.mobileNo = data[i].customerClient.mobileNo;
              this.countallData.dob = data[i].customerClient.dob;
              this.countViewList.push(JSON.parse(JSON.stringify(this.countallData)));
              this.OrigincountViewList.push(JSON.parse(JSON.stringify(this.countallData)));
            }

          }

        }
      })
    }
  }

  // edit contact
  redirectToEditContact(originalEmailId) {
    sessionStorage.setItem('originalEmailId', originalEmailId);
    this.previewService.commingFrom = "Dashboard";
    this.router.navigate(['/edit-contact']);

  }



  // new changes



  archiveblacklistContact(value) {
    this.archiveCamp = {};
    this.archiveList = [];
    for (let i in this.countViewList) {
      if ($("#check_" + this.countViewList[i].customerClientId).is(":checked")) {
        this.archiveCamp.customerClientId = JSON.parse(JSON.stringify(this.countViewList[i].customerClientId));
        this.archiveCamp.listId = JSON.parse(JSON.stringify(this.countViewList[i].listId));
        if (value == "archive") {
          this.archiveCamp.archive = "1";
          this.archiveCamp.action = "archive";
        } else if (value == "unsubscribe") {
          this.archiveCamp.unsubscribed = "1";
          this.archiveCamp.action = "unsubscribe";
        }
        else {
          this.archiveCamp.blacklist = "1";
          this.archiveCamp.action = "blacklist";
        }
        this.archiveCamp.customerId = sessionStorage.getItem("customerId");
        this.archiveList.push(JSON.parse(JSON.stringify(this.archiveCamp)));
      }
    }


    if (this.archiveList.length != 0) {
      if (value == "archive") {
        Swal.fire({
          title: this.archiveList.length + ' record selected !',

          text: "Are you sure want to archive!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Archive it!'
        }).then((result) => {

          if (result.isConfirmed) {
            let resp = this.conatctServicesService.blockArchiveContactList(this.archiveList, value);
            resp.subscribe(data => {
              if (data != 0) {
                // this.allContactPagination();
                for (let i in this.OrigincountViewList) {
                  if ($("#check_" + this.OrigincountViewList[i].customerClientId).is(":checked")) {
                    if (value == "archive") {
                      this.OrigincountViewList[i].archive = "1";
                    } else if (value == "unsubscribe") {
                      this.OrigincountViewList[i].unsubscribed = "1";
                    } else {
                      this.OrigincountViewList[i].blacklist = "1";
                    }
                    if ($("#check_" + this.OrigincountViewList[i].customerClientId).prop("checked", true) || $("#allcheck").is(":checked") == true) {
                      $("#check_" + this.OrigincountViewList[i].customerClientId).prop("checked", false);
                      $("#allcheck").prop("checked", false)
                    }
                    else {
                      $("#check_" + this.OrigincountViewList[i].customerClientId).prop("checked", false);
                      $("#allcheck").prop("checked", false)
                    }

                  }
                }
                Swal.fire(
                  'Archive!',
                  'Conatct has been archived',
                  'success'
                )
                this.filterData();
              }

            });

          }
        })
      } else if (value == "unsubscribe") {
        Swal.fire({
          title: this.archiveList.length + ' record selected !',

          text: "Are you sure want to unsubscribe!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Unsubscribe it!'
        }).then((result) => {

          if (result.isConfirmed) {
            let resp = this.conatctServicesService.blockArchiveContactList(this.archiveList, value);
            resp.subscribe(data => {
              if (data != 0) {
                // this.allContactPagination();
                for (let i in this.OrigincountViewList) {
                  if ($("#check_" + this.OrigincountViewList[i].customerClientId).is(":checked")) {
                    if (value == "archive") {
                      this.OrigincountViewList[i].archive = "1";
                    } if (value == "unsubscribe") {
                      this.OrigincountViewList[i].unsubscribed = "1";
                    } else {
                      this.OrigincountViewList[i].blacklist = "1";
                    }
                    if ($("#check_" + this.OrigincountViewList[i].customerClientId).prop("checked", true) || $("#allcheck").is(":checked") == true) {
                      $("#check_" + this.OrigincountViewList[i].customerClientId).prop("checked", false);
                      $("#allcheck").prop("checked", false)
                    }
                    else {
                      $("#check_" + this.OrigincountViewList[i].customerClientId).prop("checked", false);
                      $("#allcheck").prop("checked", false)
                    }

                  }
                }
                Swal.fire(
                  'Unsubscribed!',
                  'Conatct has been unsubscribed',
                  'success'
                )
                this.filterData();
              }

            });

          }
        });
      } else {
        Swal.fire({
          title: this.archiveList.length + ' record selected !',

          text: "Are you sure want to blacklist!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Blacklist it!'
        }).then((result) => {

          if (result.isConfirmed) {
            let resp = this.conatctServicesService.blockArchiveContactList(this.archiveList, value);
            resp.subscribe(data => {
              if (data != 0) {
                // this.allContactPagination();
                for (let i in this.OrigincountViewList) {
                  if ($("#check_" + this.OrigincountViewList[i].customerClientId).is(":checked")) {
                    if (value == "archive") {
                      this.OrigincountViewList[i].archive = "1";
                    } if (value == "unsubscribe") {
                      this.OrigincountViewList[i].unsubscribed = "1";
                    } else {
                      this.OrigincountViewList[i].blacklist = "1";
                    }
                    if ($("#check_" + this.OrigincountViewList[i].customerClientId).prop("checked", true) || $("#allcheck").is(":checked") == true) {
                      $("#check_" + this.OrigincountViewList[i].customerClientId).prop("checked", false);
                      $("#allcheck").prop("checked", false)
                    }
                    else {
                      $("#check_" + this.OrigincountViewList[i].customerClientId).prop("checked", false);
                      $("#allcheck").prop("checked", false)
                    }

                  }
                }
                Swal.fire(
                  'Blacklist!',
                  'Conatct has been blacklisted',
                  'success'
                )
                this.filterData();
              }

            });

          }
        });
      }

    } else {
      Swal.fire("Please select at least one contact!");
    }

  }



  download() {
    this.customerClientList = [];
    this.downloadCustomerData = [];
    for (let i in this.countViewList) {
      // this.customerClientList.dob = moment(this.alldownloadableData[i].dob).format('DD-MM-YYYY');
      if (this.countclkId == "allcount" || this.countclkId == "blackcount") {
        this.customerClientList = this.countViewList[i];
        this.customerClientList.First_Name = this.countViewList[i].firstName;
        this.customerClientList.Last_Name = this.countViewList[i].lastName;
        this.customerClientList.Email_Address = this.countViewList[i].originalEmailId;
        if (this.countViewList[i].mobileCountryCode != null) {
          this.customerClientList.Country_Code = this.countViewList[i].mobileCountryCode;
        }
        else {
          this.customerClientList.Country_Code = "";
        }
        if (this.countViewList[i].mobileNo != null) {
          this.customerClientList.Mobile_No = this.countViewList[i].mobileNo;
        }
        else {
          this.customerClientList.Mobile_No = "";
        }
        if (this.countViewList[i].dob != null) {
          this.customerClientList.Date_of_birth = moment(this.countViewList[i].dob).format('DD-MM-yyyy');
        }
        else {
          this.customerClientList.Date_of_birth = "";
        }
        if (this.countViewList[i].city != null) {
          this.customerClientList.City = this.countViewList[i].city;
        }
        else {
          this.customerClientList.City = "";
        }
        if (this.countViewList[i].companyName != null) {
          this.customerClientList.Company_Name = this.countViewList[i].companyName;
        }
        else {
          this.customerClientList.Company_Name = "";
        }
        if (this.countViewList[i].blacklist == 1 || this.countViewList[i].blacklist == "1") {
          this.customerClientList.Blacklist = this.countViewList[i].blacklist;
          this.customerClientList.Blacklist = "Y"
        }
        else {
          this.customerClientList.Blacklist = "N";
        }
        if (this.countViewList[i].archive == 1 || this.countViewList[i].archive == "1") {
          this.customerClientList.Archive = this.countViewList[i].archive;
          this.customerClientList.Archive = "Y"
        }
        else {
          this.customerClientList.Archive = "N";
        }
        if (this.countViewList[i].unsubscribed == 1 || this.countViewList[i].unsubscribed == "1") {
          this.customerClientList.Unsubscribed = this.countViewList[i].unsubscribed;
          this.customerClientList.Unsubscribed = "Y"
        }
        else {
          this.customerClientList.Unsubscribed = "N";
        }

      } else {
        this.customerClientList = this.countViewList[i];
        this.customerClientList.First_Name = this.countViewList[i].firstName;
        this.customerClientList.Last_Name = this.countViewList[i].lastName;
        this.customerClientList.Email_Address = this.countViewList[i].originalEmailId;
        if (this.countViewList[i].mobileCountryCode != null) {
          this.customerClientList.Country_Code = this.countViewList[i].mobileCountryCode;
        }
        else {
          this.customerClientList.Country_Code = "";
        }
        if (this.countViewList[i].mobileNo != null) {
          this.customerClientList.Mobile_No = this.countViewList[i].mobileNo;
        }
        else {
          this.customerClientList.Mobile_No = "";
        }
        if (this.countViewList[i].dob != null) {
          this.customerClientList.Date_of_birth = moment(this.countViewList[i].dob).format('DD-MM-yyyy');
        }
        else {
          this.customerClientList.Date_of_birth = "";
        }
        if (this.countViewList[i].city != null) {
          this.customerClientList.City = this.countViewList[i].city;
        }
        else {
          this.customerClientList.City = "";
        }
        if (this.countViewList[i].companyName != null) {
          this.customerClientList.Company_Name = this.countViewList[i].companyName;
        }
        else {
          this.customerClientList.Company_Name = "";
        }
        if (this.countViewList[i].blacklist == 1 || this.countViewList[i].blacklist == "1") {
          this.customerClientList.Blacklist = this.countViewList[i].blacklist;
          this.customerClientList.Blacklist = "Y"
        }
        else {
          this.customerClientList.Blacklist = "N";
        }
        if (this.countViewList[i].archive == 1 || this.countViewList[i].archive == "1") {
          this.customerClientList.Archive = this.countViewList[i].archive;
          this.customerClientList.Archive = "Y"
        }
        else {
          this.customerClientList.Archive = "N";
        }
        if (this.countViewList[i].unsubscribed == 1 || this.countViewList[i].unsubscribed == "1") {
          this.customerClientList.Unsubscribed = this.countViewList[i].unsubscribed;
          this.customerClientList.Unsubscribed = "Y"
        }
        else {
          this.customerClientList.Unsubscribed = "N";
        }
      }

      this.downloadCustomerData.push(this.customerClientList);
    }

    this.conatctServicesService.downloadCSVFile(this.downloadCustomerData, this.pageTitile);
  }

  exportAsXLSX(): void {
    this.customerClientList = [];
    this.downloadCustomerData = [];
    for (let i in this.countViewList) {
      this.customerClientList = {};

      if (this.countclkId == "allcount" || this.countclkId == "blackcount") {


        this.customerClientList.First_Name = this.countViewList[i].firstName;
        this.customerClientList.Last_Name = this.countViewList[i].lastName;
        this.customerClientList.Email_Address = this.countViewList[i].originalEmailId;
        if (this.countViewList[i].mobileCountryCode != null) {
          this.customerClientList.Country_Code = this.countViewList[i].mobileCountryCode;
        }
        else {
          this.customerClientList.Country_Code = "";
        }
        if (this.countViewList[i].mobileNo != null) {
          this.customerClientList.Mobile_No = this.countViewList[i].mobileNo;
        }
        else {
          this.customerClientList.Mobile_No = "";
        }
        if (this.countViewList[i].dob != null) {
          this.customerClientList.Date_of_birth = moment(this.countViewList[i].dob).format('YYYY-MM-DD');
        }
        else {
          this.customerClientList.Date_of_birth = null;
        }
        if (this.countViewList[i].city != null) {
          this.customerClientList.City = this.countViewList[i].city;
        }
        else {
          this.customerClientList.City = "";
        }
        if (this.countViewList[i].companyName != null) {
          this.customerClientList.Company_Name = this.countViewList[i].companyName;
        }
        else {
          this.customerClientList.Company_Name = "";
        }
        if (this.countViewList[i].blacklist == 1 || this.countViewList[i].blacklist == "1") {
          this.customerClientList.Blacklist = this.countViewList[i].blacklist;
          this.customerClientList.Blacklist = "Y";
        }
        else {
          this.customerClientList.Blacklist = "N";
        }
        if (this.countViewList[i].archive == 1 || this.countViewList[i].archive == "1") {
          this.customerClientList.Archive = this.countViewList[i].archive;
          this.customerClientList.Archive = "Y"
        }
        else {
          this.customerClientList.Archive = "N";
        }
        if (this.countViewList[i].unsubscribed == 1 || this.countViewList[i].unsubscribed == "1") {
          this.customerClientList.Unsubscribed = this.countViewList[i].unsubscribed;
          this.customerClientList.Unsubscribed = "Y"
        }
        else {
          this.customerClientList.Unsubscribed = "N";
        }


      } else {
        this.customerClientList.First_Name = this.countViewList[i].firstName;
        this.customerClientList.Last_Name = this.countViewList[i].lastName;
        this.customerClientList.Email_Address = this.countViewList[i].originalEmailId;
        if (this.countViewList[i].mobileCountryCode != null) {
          this.customerClientList.Country_Code = this.countViewList[i].mobileCountryCode;
        }
        else {
          this.customerClientList.Country_Code = "";
        }
        if (this.countViewList[i].mobileNo != null) {
          this.customerClientList.Mobile_No = this.countViewList[i].mobileNo;
        }
        else {
          this.customerClientList.Mobile_No = "";
        }
        if (this.countViewList[i].dob != null) {
          this.customerClientList.Date_of_birth = moment(this.countViewList[i].dob).format('YYYY-MM-DD');
        }
        else {
          this.customerClientList.Date_of_birth = null;
        }
        if (this.countViewList[i].city != null) {
          this.customerClientList.City = this.countViewList[i].city;
        }
        else {
          this.customerClientList.City = "";
        }
        if (this.countViewList[i].companyName != null) {
          this.customerClientList.Company_Name = this.countViewList[i].companyName;
        }
        else {
          this.customerClientList.Company_Name = "";
        }
        if (this.countViewList[i].blacklist == 1 || this.countViewList[i].blacklist == "1") {
          this.customerClientList.Blacklist = this.countViewList[i].blacklist;
          this.customerClientList.Blacklist = "Y";
        }
        else {
          this.customerClientList.Blacklist = "N";
        }
        if (this.countViewList[i].archive == 1 || this.countViewList[i].archive == "1") {
          this.customerClientList.Archive = this.countViewList[i].archive;
          this.customerClientList.Archive = "Y"
        }
        else {
          this.customerClientList.Archive = "N";
        }
        if (this.countViewList[i].unsubscribed == 1 || this.countViewList[i].unsubscribed == "1") {
          this.customerClientList.Unsubscribed = this.countViewList[i].unsubscribed;
          this.customerClientList.Unsubscribed = "Y"
        }
        else {
          this.customerClientList.Unsubscribed = "N";
        }

      }

      this.downloadCustomerData.push(this.customerClientList);
    }
    this.conatctServicesService.exportAsExcelFile(this.downloadCustomerData, this.pageTitile);
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

  activeDeactive() {
    if (this.activedeactive == 0) {
      Swal.fire("Please select file type");
    }
    if (this.activedeactive == 1) {
      this.download();
    }
    if (this.activedeactive == 2) {
      this.exportAsXLSX();
    }
  }

  delete() {
    this.deletecontact = {};
    this.deletecontactList = [];
    // console.log(this.countViewList);
    
    for (let i in this.countViewList) {
      if ($("#check_" + this.countViewList[i].customerClientId).is(":checked")) {
        this.deletecontact.listId = JSON.parse(JSON.stringify(this.countViewList[i].listId));
        this.deletecontact.customerClientId = JSON.parse(JSON.stringify(this.countViewList[i].customerClientId));
        this.deletecontact.customerId = sessionStorage.getItem("customerId");
        this.deletecontactList.push(JSON.parse(JSON.stringify(this.deletecontact)));
      }
    }
    // console.log(this.deletecontactList);
    Swal.fire({
      title: this.deletecontactList.length + ' record selected !',

      text: "Are you sure want to delete!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
      if (result.isConfirmed) {

        let resp = this.conatctServicesService.deleteContact(this.deletecontactList);
        resp.subscribe(data => {
          if (data != 0) {
            for (let i in this.countViewList) {
              for (let k in this.deletecontactList) {
                if (this.deletecontactList[k].customerClientId === this.countViewList[i].customerClientId) {
                  this.countViewList.splice(i, 1);
                }
              }
            }
            for (let i in this.OrigincountViewList) {
              for (let k in this.deletecontactList) {
                if (this.deletecontactList[k].customerClientId === this.OrigincountViewList[i].customerClientId) {
                  this.OrigincountViewList.splice(i, 1);
                }
              }
            }
            Swal.fire(
              'Delete!',
              'Conatct has been deleted',
              'success'
            )
          }
        });
      }
    })
  }


}