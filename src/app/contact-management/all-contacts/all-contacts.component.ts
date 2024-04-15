import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from "@angular/common";
import { ConatctServicesService } from '../contact-management-service/conatct-services.service';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
import Swal from 'sweetalert2';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as moment from 'moment';
declare var $: any


@Component({
  selector: 'app-all-contacts',
  templateUrl: './all-contacts.component.html',
  styleUrls: ['./all-contacts.component.css']
})
export class AllContactsComponent implements OnInit {

  //Select all checkbox
  title: String;
  checkboxes: boolean[];
  selectedRow: Number;
  selectedAll: any;
  customerClientIdList: any = [];
  customerClientList: any = [];
  downloadCustomerData: any = [];
  blackList: any = [];
  dataForExcel: any = [];

  //end code

  itrationCount = null;

  search;
  private term: string = "";
  filterFlg = "";
  filterDelete = "";

  //Pagination
  p = 1;
  showData: any = {
    rowsPerPage: 5
  };

  // Select filter 
  activedeactive;
  selectFilter = null;
  filter = ['.CSV', '.XLSX / .XLS'];
  allContactData: any = [];
  selectedallContactList: any = {};
  allcustomerClientIdList: any = [];
  size: any;
  blacklistflag: any;
  groupData: any;

  userData: any = {
    listId: "",
    firstName: "",
    lastName: "",
    originalEmailId: "",
    mobileNo: "",
    dob: "",
    customerClientId: "",
    blacklist: ""
  };
  editcontactList: any[];
  customerEditList: any[];
  archiveallcontact: any = {};
  archivecontactList: any[];
  deletecontactList: any = [];
  deletecontact: any = {};

  constructor(private router: Router, private location: Location, private previewService: PreviewService, private conatctServicesService: ConatctServicesService) {
    this.title = "Select all/Deselect all checkbox ";
    if (this.previewService.selectedallContactList != null && this.previewService.selectedallContactList != undefined && this.previewService.selectedallContactList != "") {
      this.userData = this.previewService.selectedallContactList
      if (sessionStorage.getItem("listId") != null && sessionStorage.getItem("listId") != undefined && sessionStorage.getItem("listId") != "") {

        this.fetchAllContacts(sessionStorage.getItem("listId"), this.userData.contactCount);
        // console.log(this.userData.contactCount, "--------------");

      } else {
        this.router.navigate(['/create-list']);
      }
    } else {
      this.router.navigate(['/create-list']);
    }
    this.groupData = this.organise(this.downloadCustomerData);
  }

  ngOnInit(): void {
    this.checkboxes = new Array(this.userData.length);
    this.checkboxes.fill(false);
    this.activedeactive = 0;
    //this.fetchAllContacts(sessionStorage.getItem("listId"));       
  }

  setClickedRow(index) {
    this.selectedRow = index;
  }

  selectAll() {
    if ($("#allcheck").is(":checked")) {
      for (let i in this.customerClientIdList) {
        $("#check_" + this.customerClientIdList[i].customerClientId).prop("checked", true);
      }
    } else {
      for (let i in this.customerClientIdList) {
        $("#check_" + this.customerClientIdList[i].customerClientId).prop("checked", false);
      }
    }
  }

  toggleSelection(event, i) {
    // this.checkboxes[i] = event.target.checked;
  }

  loadingMessage() {
    Swal.fire("Please wait while data is loading...");
  }

  redirectToEditContact(i, customerClientId) {
    this.selectedallContactList = [];
    for (let i in this.customerClientIdList) {
      if (this.customerClientIdList[i].customerClientId == customerClientId) {
        this.selectedallContactList = this.customerClientIdList[i];
        sessionStorage.setItem('originalEmailId', this.customerClientIdList[i].customerClient.originalEmailId);
        sessionStorage.setItem('customerClientId', this.customerClientIdList[i].customerClient.customerClientId);
      }
    }
    this.selectedallContactList.contactCount = this.userData.contactCount;
    this.previewService.selectedallContactList = this.selectedallContactList;
    this.router.navigate(['/edit-contact']);
  }

  filterData() {
    this.allContactData = [];

    for (let i in this.customerClientIdList) {
      if (this.filterFlg === "Blacklist" &&
        this.customerClientIdList[i].customerClient.blacklist == '1') {
        this.allContactData.push(this.customerClientIdList[i]);
      } else if (this.filterFlg === "Archive" &&
        this.customerClientIdList[i].customerClient.archive == '1') {
        this.allContactData.push(this.customerClientIdList[i]);
      } else if (this.filterFlg === "Unsubscribe" &&
        this.customerClientIdList[i].customerClient.unsubscribed == '1') {
        this.allContactData.push(this.customerClientIdList[i]);
      }
      if (this.filterFlg === "" || this.filterFlg === " ") {
        this.allContactData.push(this.customerClientIdList[i]);
      }
    }
  }

  fetchAllContacts(listId, contactCount) {
    this.customerClientIdList = []
    this.allContactData = [];

    this.itrationCount = 1;
    let startNo = 0;
    let size = 500;
    let count = Number(contactCount);
    let itration = Math.ceil(count / size);
    for (var i = 0; i <= itration; i++) {
      this.itrationCount++;
      if (i != 0) {
        startNo = size + startNo;
      }
      let resp = this.conatctServicesService.fetchAllContacts(startNo, size, sessionStorage.getItem("listId"), sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        this.itrationCount--;
        if (data != null) {
          if (data[0].customerId != null && data[0].customerId != "") {
            for (let i in data) {
              this.customerClientIdList.push(data[i]);
              this.allContactData.push(data[i]);
            }
          }
        }
      });
    }
  }


  // new changes

  archiveblacklistContact(value) {
    this.archiveallcontact = {};
    this.archivecontactList = [];
    for (let i in this.allContactData) {
      if ($("#check_" + this.allContactData[i].customerClient.customerClientId).is(":checked")) {
        this.archiveallcontact.customerClientId = JSON.parse(JSON.stringify(this.allContactData[i].customerClientId));
        this.archiveallcontact.listId = JSON.parse(JSON.stringify(this.allContactData[i].listId));
        if (value == "archive") {
          this.archiveallcontact.archive = "1";
          this.archiveallcontact.action = "archive";
        } else if (value == "unsubscribe") {
          this.archiveallcontact.unsubscribed = "1";
          this.archiveallcontact.action = "unsubscribe";
        } else {
          this.archiveallcontact.blacklist = "1";
          this.archiveallcontact.action = "blacklist";
        }
        this.archiveallcontact.customerId = sessionStorage.getItem("customerId");
        this.archivecontactList.push(JSON.parse(JSON.stringify(this.archiveallcontact)));
      }
    }


    if (this.archivecontactList.length != 0) {
      if (value == "archive") {
        Swal.fire({
          title: this.archivecontactList.length + ' record selected !',

          text: "Are you sure want to archive!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Archive it!'
        }).then((result) => {

          if (result.isConfirmed) {
            let resp = this.conatctServicesService.blockArchiveContactList(this.archivecontactList, value);
            resp.subscribe(data => {
              if (data != 0) {
                for (let i in this.customerClientIdList) {
                  if ($("#check_" + this.customerClientIdList[i].customerClient.customerClientId).is(":checked")) {
                    if (value == "archive") {
                      this.customerClientIdList[i].customerClient.archive = "1";
                    } else if (value == "unsubscribe") {
                      this.customerClientIdList[i].customerClient.unsubscribed = "1";
                    } else {
                      this.customerClientIdList[i].customerClient.blacklist = "1";
                    }
                    if ($("#check_" + this.customerClientIdList[i].customerClient.customerClientId).prop("checked", true) || $("#allcheck").is(":checked") == true) {
                      $("#check_" + this.customerClientIdList[i].customerClient.customerClientId).prop("checked", false);
                      $("#allcheck").prop("checked", false)
                    }
                    else {
                      $("#check_" + this.customerClientIdList[i].customerClient.customerClientId).prop("checked", false);
                      $("#allcheck").prop("checked", false)
                    }
                  }
                }
                Swal.fire(
                  'Archive!',
                  'Conatct has been archived',
                  'success'
                )
              }
              this.filterData();
            });

          }
        })
      } else if (value == "unsubscribe") {
        Swal.fire({
          title: this.archivecontactList.length + ' record selected !',

          text: "Are you sure want to unsubscribe!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Unsubscribe it!'
        }).then((result) => {

          if (result.isConfirmed) {
            let resp = this.conatctServicesService.blockArchiveContactList(this.archivecontactList, value);
            resp.subscribe(data => {
              if (data != 0) {
                for (let i in this.customerClientIdList) {
                  if ($("#check_" + this.customerClientIdList[i].customerClient.customerClientId).is(":checked")) {
                    if (value == "archive") {
                      this.customerClientIdList[i].customerClient.archive = "1";
                    } else if (value == "unsubscribe") {
                      this.customerClientIdList[i].customerClient.unsubscribed = "1";
                    }
                    else {
                      this.customerClientIdList[i].customerClient.blacklist = "1";
                    }
                  }
                  if ($("#check_" + this.customerClientIdList[i].customerClient.customerClientId).prop("checked", true) || $("#allcheck").is(":checked") == true) {
                    $("#check_" + this.customerClientIdList[i].customerClient.customerClientId).prop("checked", false);
                    $("#allcheck").prop("checked", false);
                  }
                  else {
                    $("#check_" + this.customerClientIdList[i].customerClient.customerClientId).prop("checked", false);
                    $("#allcheck").prop("checked", false);
                  }

                }
                Swal.fire(
                  'Unsubscribe!',
                  'Conatct has been unsubscribed',
                  'success'
                )
              }
              this.filterData();
            });

          }
        });

      } else {
        Swal.fire({
          title: this.archivecontactList.length + ' record selected !',

          text: "Are you sure want to blacklist!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Blacklist it!'
        }).then((result) => {

          if (result.isConfirmed) {
            let resp = this.conatctServicesService.blockArchiveContactList(this.archivecontactList, value);
            resp.subscribe(data => {
              if (data != 0) {
                for (let i in this.customerClientIdList) {
                  if ($("#check_" + this.customerClientIdList[i].customerClient.customerClientId).is(":checked")) {
                    if (value == "archive") {
                      this.customerClientIdList[i].customerClient.archive = "1";
                    } else if (value == "unsubscribe") {
                      this.customerClientIdList[i].customerClient.unsubscribed = "1";
                    }
                    else {
                      this.customerClientIdList[i].customerClient.blacklist = "1";
                    }
                  }
                  if ($("#check_" + this.customerClientIdList[i].customerClient.customerClientId).prop("checked", true) || $("#allcheck").is(":checked") == true) {
                    $("#check_" + this.customerClientIdList[i].customerClient.customerClientId).prop("checked", false);
                    $("#allcheck").prop("checked", false);
                  }
                  else {
                    $("#check_" + this.customerClientIdList[i].customerClient.customerClientId).prop("checked", false);
                    $("#allcheck").prop("checked", false);
                  }

                }
                Swal.fire(
                  'Blacklist!',
                  'Conatct has been blacklisted',
                  'success'
                )
              }
              this.filterData();
            });

          }
        })

      }
    } else {
      Swal.fire("Please select at least one contact!");
    }

  }


  download() {
    this.customerClientList = [];
    this.downloadCustomerData = [];
    for (let i in this.allContactData) {
      this.customerClientList.dob = moment(this.allContactData[i].dob).format('DD-MM-YYYY');
      this.customerClientList = this.allContactData[i].customerClient;
      if (this.allContactData[i].customerClient.blacklist == "1") {
        this.customerClientList.Blacklist = this.allContactData[i].customerClient.blacklist;
        this.customerClientList.Blacklist = "Y"
      }
      else {
        this.customerClientList.Blacklist = "N";
      }
      if (this.allContactData[i].customerClient.archive == "1") {
        this.customerClientList.Archive = this.allContactData[i].customerClient.archive;
        this.customerClientList.Archive = "Y"
      }
      else {
        this.customerClientList.Archive = "N";
      }
      if (this.allContactData[i].customerClient.unsubscribed == "1") {
        this.customerClientList.Unsubscribed = this.allContactData[i].customerClient.unsubscribed;
        this.customerClientList.Unsubscribed = "Y"
      }
      else {
        this.customerClientList.Unsubscribed = "N";
      }
      if (this.allContactData[i].customerClient.firstName != null) {
        this.customerClientList.First_Name = this.allContactData[i].customerClient.firstName;
      }
      else {
        this.customerClientList.First_Name = "";
      }
      if (this.allContactData[i].customerClient.lastName != null) {
        this.customerClientList.Last_Name = this.allContactData[i].customerClient.lastName;
      }
      else {
        this.customerClientList.Last_Name = "";
      }
      if (this.allContactData[i].customerClient.originalEmailId != null) {
        this.customerClientList.Email_Address = this.allContactData[i].customerClient.originalEmailId;
      }
      else {
        this.customerClientList.Email_Address = "";
      }
      if (this.allContactData[i].customerClient.mobileCountryCode != null) {
        this.customerClientList.Country_Code = this.allContactData[i].customerClient.mobileCountryCode;
      }
      else {
        this.customerClientList.Country_Code = "";
      }
      if (this.allContactData[i].customerClient.mobileNo != null) {
        this.customerClientList.Mobile_No = this.allContactData[i].customerClient.mobileNo;
      }
      else {
        this.customerClientList.Mobile_No = "";
      }
      if (this.allContactData[i].customerClient.dob != null) {
        this.customerClientList.Date_of_birth = moment(this.allContactData[i].customerClient.dob).format('YYYY-MM-DD');
      }
      else {
        this.customerClientList.Date_of_birth = "";
      }
      if (this.allContactData[i].customerClient.city != null) {
        this.customerClientList.City = this.allContactData[i].customerClient.city;
      }
      else {
        this.customerClientList.City = "";
      }
      if (this.allContactData[i].customerClient.companyName != null) {
        this.customerClientList.Company_Name = this.allContactData[i].customerClient.companyName;
      }
      else {
        this.customerClientList.Company_Name = "";
      }

      this.downloadCustomerData.push(this.customerClientList);
    }

    this.conatctServicesService.downloadCSVFile(this.downloadCustomerData, sessionStorage.getItem("listName"));
  }

  exportAsXLSX(): void {
    this.customerClientList = [];
    this.downloadCustomerData = [];
    for (let i in this.allContactData) {
      this.customerClientList = {};
      this.customerClientList.First_Name = this.allContactData[i].customerClient.firstName;
      this.customerClientList.Last_Name = this.allContactData[i].customerClient.lastName;
      this.customerClientList.Email_Address = this.allContactData[i].customerClient.originalEmailId;
      if (this.allContactData[i].customerClient.mobileCountryCode != null || this.allContactData[i].customerClient.mobileCountryCode != '') {
        this.customerClientList.Country_Code = this.allContactData[i].customerClient.mobileCountryCode;
      }
      else {
        this.customerClientList.Country_Code = "";
      }
      if (this.allContactData[i].customerClient.mobileNo != null || this.allContactData[i].customerClient.mobileNo != null) {
        this.customerClientList.Mobile_No = this.allContactData[i].customerClient.mobileNo;
      }
      else {
        this.customerClientList.Mobile_No = "";
      }
      if (this.allContactData[i].customerClient.dob != null) {
        this.customerClientList.Date_of_birth = moment(this.allContactData[i].customerClient.dob).format('YYYY-MM-DD');
      }
      else {
        this.customerClientList.Date_of_birth = "";
      }
      if (this.allContactData[i].customerClient.city != null) {
        this.customerClientList.City = this.allContactData[i].customerClient.city;
      }
      else {
        this.customerClientList.City = "";
      }
      if (this.allContactData[i].customerClient.companyName != null) {
        this.customerClientList.Company_Name = this.allContactData[i].customerClient.companyName;
      }
      else {
        this.customerClientList.Company_Name = "";
      }
      if (this.allContactData[i].customerClient.blacklist == "1") {
        this.customerClientList.Blacklist = this.allContactData[i].customerClient.blacklist;
        this.customerClientList.Blacklist = "Y"
      }
      else {
        this.customerClientList.Blacklist = "N";
      }
      if (this.allContactData[i].customerClient.archive == "1") {
        this.customerClientList.Archive = this.allContactData[i].customerClient.archive;
        this.customerClientList.Archive = "Y"
      }
      else {
        this.customerClientList.Archive = "N";
      }
      if (this.allContactData[i].customerClient.unsubscribed == "1") {
        this.customerClientList.Unsubscribed = this.allContactData[i].customerClient.unsubscribed;
        this.customerClientList.Unsubscribed = "Y"
      }
      else {
        this.customerClientList.Unsubscribed = "N";
      }
      // console.log(this.allContactData);

      this.downloadCustomerData.push(this.customerClientList);
    }
    this.conatctServicesService.exportAsExcelFile(this.downloadCustomerData, sessionStorage.getItem("listName"));
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
    for (let i in this.allContactData) {
      if ($("#check_" + this.allContactData[i].customerClient.customerClientId).is(":checked")) {
        this.deletecontact.customerClientId = JSON.parse(JSON.stringify(this.allContactData[i].customerClientId));
        this.deletecontact.customerId = sessionStorage.getItem("customerId");
        this.deletecontact.listId = sessionStorage.getItem("listId");
        this.deletecontactList.push(JSON.parse(JSON.stringify(this.deletecontact)));
      }
    }
    // console.log(this.deletecontactList);
    if (this.deletecontactList.length > 101) {
      Swal.fire("Unable to delete more than 100 contacts, please select less than 100 contacts");
    }
    else {
      if (this.filterDelete === "universalDelete") {        
        if (this.deletecontactList.length != 0) {          
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
                  for (let i in this.allContactData) {
                    for (let k in this.deletecontactList) {
                      if (this.deletecontactList[k].customerClientId === this.allContactData[i].customerClient.customerClientId) {
                        this.allContactData.splice(i, 1);
                      }
                    }
                  }
                  for (let i in this.customerClientIdList) {
                    for (let k in this.deletecontactList) {
                      if (this.deletecontactList[k].customerClientId === this.customerClientIdList[i].customerClient.customerClientId) {
                        this.customerClientIdList.splice(i, 1);
                      }
                    }
                  }
                  Swal.fire(
                    'Delete!',
                    'Conatct has been deleted',
                    'success'
                  )
                }
                $("#allcheck").prop("checked", false);
              });
            }
          })
        }
        else {
          Swal.fire("Please select atleast 1 contact");
        }
      }
      else if (this.filterDelete === "listDelete") {
        if (this.deletecontactList.length != 0) {
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

              let resp = this.conatctServicesService.deleteContactFromList(this.deletecontactList);
              resp.subscribe(data => {
                // console.log(data, "only for list");

                if (data != 0) {
                  for (let i in this.allContactData) {
                    for (let k in this.deletecontactList) {
                      if (this.deletecontactList[k].customerClientId === this.allContactData[i].customerClient.customerClientId) {
                        this.allContactData.splice(i, 1);
                      }
                    }
                  }
                  for (let i in this.customerClientIdList) {
                    for (let k in this.deletecontactList) {
                      if (this.deletecontactList[k].customerClientId === this.customerClientIdList[i].customerClient.customerClientId) {
                        this.customerClientIdList.splice(i, 1);
                      }
                    }
                  }
                  Swal.fire(
                    'Delete!',
                    'Contact has been deleted',
                    'success'
                  )
                }
                $("#allcheck").prop("checked", false);
              });
            }
          })
        }
        else {
          Swal.fire("Please select atleast 1 contact");
        }
      }
    }
  }

}
