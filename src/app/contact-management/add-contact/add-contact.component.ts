import { Component, OnInit, ElementRef } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { DatePipe, Location } from "@angular/common";
import { ConatctServicesService } from '../contact-management-service/conatct-services.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ViewChild } from '@angular/core';
import { AccountServicesService } from 'src/app/account-management/account-services/account-services.service';
declare var $;
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

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {
  @ViewChild('closenewListModal') closenewListModal: ElementRef;

  avilable = false;
  search;
  OriginlistData = [];
  contactList: any = [];
  editMode = false;
  customerId: any;
  listId: any;
  mobilecodeList: any;
  dismiss = false;
  dobflag = 0;
  nodataFlg = false;
  submitFlg = false;
  balance: any = [];

  contactInfo: any = {
    originalEmailId: "",
    mobileNo: "",
    mobileCountryCode: "",
    dob: "",
    firstName: "",
    lastName: "",
    companyName: "",
    city: "",
    listId: "",
    update: ""
  };

  listInfo: any = {
    listDescription: "",
    listName: "",
    listId: ""
  };

  constructor(private router: Router, private location: Location, private conatctServicesService: ConatctServicesService, public datepipe: DatePipe, private accountServicesService: AccountServicesService) { }

  ngOnInit(): void {
    this.getAllListDetails();
    this.customerId = sessionStorage.getItem("customerId");
    this.mobileCountryCode();
    this.dismiss = true;
    this.getProduct();
  }

  // form submit 
  saveList(createList: NgForm) {
    this.submitFlg = true;
    this.closenewListModal.nativeElement.click();
    document.getElementById('newList').click();
    this.listInfo.customerId = sessionStorage.getItem('customerId');
    if (this.listInfo.listName != null && this.listInfo.listName != undefined && this.listInfo.listName != "") {
      this.saveListDetails();
    }

    createList.resetForm();
  }

  getProduct(){
    let resp = this.accountServicesService.getBalanceDetails(sessionStorage.getItem("customerId"));
    resp.subscribe(data => {
      if (data != null) {
        this.balance = data;
      }
    });
  }

  saveaddContact(addContact: NgForm) {
    var flg = 0;
    this.contactList = [];
    for (let i in this.OriginlistData) {
      if ($('#' + this.OriginlistData[i].listId).is(":checked")) {
        flg = 1;
        this.contactInfo.listId = JSON.parse(JSON.stringify(this.OriginlistData[i].listId));
        this.contactInfo.customerId = this.customerId;
        this.contactList.push(JSON.parse(JSON.stringify(this.contactInfo)));
      }
    }

    if (flg == 1) {
      if (this.balance.length !=0 && this.balance.dimProduct.productName == 'Premium') {
        Swal.fire({
          title: 'Do you want to verify email address?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: `Yes`,
          denyButtonText: `No`,
          showLoaderOnConfirm: true,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire({
              title: "Please wait while we're verifying!",
              allowEscapeKey: false,
              allowOutsideClick: false,
              onOpen: () => {
                Swal.showLoading();
              }
            })
            let resp = this.conatctServicesService.getMailIdVerification(this.contactInfo.originalEmailId);
            resp.subscribe(data => {

              if (data != 'null' && data != null) {
                if (data == 0) {
                  Swal.fire({
                    title: 'Invalid email address',
                    text: 'Do you want to save it?',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: `Yes`,
                    denyButtonText: `No`,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.submitFlg = true;
                      let resp = this.conatctServicesService.saveaddContact(this.contactList);
                      resp.subscribe(data => {
                        if (data == 2) {
                          Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Failed to store details!',
                            showConfirmButton: false,
                            timer: 4500
                          })
                        } else {
                          this.submitFlg = false;
                          Toast.fire({
                            icon: 'success',
                            title: 'Contact added succesfully'
                          })
                          this.clearUser();
                          addContact.resetForm();
                        }
                        this.avilable = false;
                      });
                      // Swal.fire('Contact Saved', 'Email-id not verified', 'success')
                    } else if (result.isDenied) {
                      this.avilable = false;
                      this.clearUser();
                      addContact.resetForm();
                      Swal.fire('Contact details discarded', '', 'info')

                    }
                    // else if (result.isDismissed) {
                    //   this.avilable = false;
                    //   this.clearUser();
                    //   addContact.resetForm();
                    //   Swal.fire('Contact details discarded', '', 'info')
                    // }
                  })
                }
                else if (data == 2) {
                  var email = this.contactInfo.originalEmailId;
                  var name = email.substring(0, email.lastIndexOf("@"));
                  var domain = email.substring(email.lastIndexOf("@") + 1);
                  Swal.fire({
                    title: 'Unknown username -' + '(' + name + ')',
                    text: 'Do you want to save it?',
                    footer: domain + " is valid but can't identify " + name,
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: `Yes`,
                    denyButtonText: `No`,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.submitFlg = true;
                      let resp = this.conatctServicesService.saveaddContact(this.contactList);
                      resp.subscribe(data => {
                        if (data == 2) {
                          Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Failed to store details!',
                            showConfirmButton: false,
                            timer: 4500
                          })
                        } else {
                          this.submitFlg = false;
                          Toast.fire({
                            icon: 'success',
                            title: 'Contact added succesfully'
                          })
                          this.clearUser();
                          addContact.resetForm();
                        }
                        this.avilable = false;
                      });
                      // Swal.fire('Contact Saved', 'Email-id not verified', 'success')
                    } else if (result.isDenied) {
                      this.avilable = false;
                      this.clearUser();
                      addContact.resetForm();
                      Swal.fire('Contact details discarded', '', 'info')

                    }
                    // else if (result.isDismissed) {
                    //   this.avilable = false;
                    //   this.clearUser();
                    //   addContact.resetForm();
                    //   Swal.fire('Contact details discarded', '', 'info')
                    // }
                  })
                }
                else if (data == 1) {
                  Swal.fire({
                    title: 'Valid email address',
                    text: 'Do you want to save it?',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: `Yes`,
                    denyButtonText: `No`,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.submitFlg = true;
                      let resp = this.conatctServicesService.saveaddContact(this.contactList);
                      resp.subscribe(data => {
                        if (data == 2) {
                          Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Failed to store details!',
                            showConfirmButton: false,
                            timer: 4500
                          })
                        } else {
                          this.submitFlg = false;
                          Toast.fire({
                            icon: 'success',
                            title: 'Contact added succesfully'
                          })
                          this.clearUser();
                          addContact.resetForm();
                        }
                        this.avilable = false;
                      });


                    } else if (result.isDenied) {

                      this.avilable = false;
                      this.clearUser();
                      addContact.resetForm();
                      Swal.fire('Contact details discarded', '', 'info')

                    }
                    // else if (result.isDismissed) {
                    //   this.avilable = false;
                    //   this.clearUser();
                    //   addContact.resetForm();
                    //   Swal.fire('Contact details discarded', '', 'info')
                    // }
                  })
                }
              }
            });



          } else if (result.isDenied) {
            this.submitFlg = true;
            let resp = this.conatctServicesService.saveaddContact(this.contactList);
            resp.subscribe(data => {
              if (data == 2) {
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'Failed to store details!',
                  showConfirmButton: false,
                  timer: 4500
                })
              } else {
                this.submitFlg = false;
                Toast.fire({
                  icon: 'success',
                  title: 'Contact added succesfully'
                })
                this.clearUser();
                addContact.resetForm();
              }
              this.avilable = false;
            });
            // Swal.fire('Contact Saved', 'Email-id not verified', 'success')
          }
          else if (result.isDismissed) {
            this.avilable = false;
            this.clearUser();
            addContact.resetForm();
            Swal.fire('Contact details discarded', '', 'info')
          }
        })
      }
      else {
        this.submitFlg = true;
        let resp = this.conatctServicesService.saveaddContact(this.contactList);
        resp.subscribe(data => {
          if (data == 2) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Failed to store details!',
              showConfirmButton: false,
              timer: 4500
            })
          } else {
            this.submitFlg = false;
            Toast.fire({
              icon: 'success',
              title: 'Contact added succesfully'
            })
            this.clearUser();
            addContact.resetForm();
          }
          this.avilable = false;
        });
      }
    }
    else {
      Swal.fire("Please select atleast one list!")
    }
  }

  saveListDetails() {
    let resp = this.conatctServicesService.createList(this.listInfo);
    resp.subscribe(data => {
      if (data != null || data != 0 || data != '0') {
        this.submitFlg = false;
        Toast.fire({
          icon: 'success',
          title: 'New list added succesfully'
        })
        this.getAllListDetails();
      }

      this.listInfo.listName = "";
      this.listInfo.listDescription = "";

    });
  }

  getAllListDetails() {
    this.OriginlistData = [];
    this.nodataFlg = false;
    let resp = this.conatctServicesService.getAllListDetails(sessionStorage.getItem('customerId'));
    resp.subscribe(data => {

      if (data != null && data != "") {
        for (let i in data) {
          if (data[i].status == '1') {
            this.OriginlistData.push(data[i]);
          }
        }
        // console.log(this.OriginlistData);

      } else {
        this.nodataFlg = true;
      }
    });
  }

  checkDuplicateList(listName) {
    //if(this.listInfo.listName != null && this.listInfo.listName!=undefined && this.listInfo.listName!=""){
    let resp = this.conatctServicesService.checkDuplicateList(listName, sessionStorage.getItem('customerId'));
    resp.subscribe(data => {
      if (data == '1' || data == 1) {
        Swal.fire("This list name already exists!");
        this.listInfo.listName = "";
      }
    });
    // }

  }

  // chk unique Email
  getUniqueCustClient(originalEmailId) {
    this.avilable = false;
    let resp = this.conatctServicesService.getUniqueCustClient(originalEmailId);
    resp.subscribe(data => {
      if (data != null && data != '') {
        this.avilable = true;
        this.contactInfo = data;
        this.contactInfo.dob = this.datepipe.transform(data.dob, "yyyy-MM-dd");

      } else {
        this.avilable = false;
      }
    });
  }

  ListIdData(ListId, i) {
    this.listId = ListId;
  }

  clear() {
    this.editMode = false;
    this.listInfo.listDescription = "",
      this.listInfo.listName = "",
      this.listInfo.listId = ""
  }

  redirectToImportContact() {
    this.router.navigate(['/import-contact']);
  }

  redirectTocreateList() {
    this.router.navigate(['/create-list']);
  }

  clearUser() {
    for (let r in this.OriginlistData) {
      $('#' + this.OriginlistData[r].listId).prop("checked", false)
    }
    this.editMode = false;

    this.contactList.customerClientSkey = "",
      this.contactList.customerClientId = ""

  }

  mobileCountryCode() {
    let resp = this.conatctServicesService.mobileCountryCode()
    resp.subscribe(data => {
      this.mobilecodeList = data;
    });
  }


  compareAge() {
    let dob = this.contactInfo.dob;
    let db = moment(dob).format("YYYY-MM-DD");
    let today = new Date();
    let temp = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    let store = moment(temp).format("YYYY-MM-DD");
    if (db <= store) {
      this.dobflag = 0;
      return {};
    }
    else {
      this.dobflag = 1;
    }
  }

  getCount(data) {
    if (data.contactCount > 20000) {
      Swal.fire("This list is full!")
      $('#' + data.listId).prop("checked", false)
    }
  }

  verifyContact() {
    // console.log(this.contactInfo.originalEmailId, '**');
    if (this.contactInfo.originalEmailId != null || this.contactInfo.originalEmailId != "" || this.contactInfo.originalEmailId != undefined) {
      Swal.fire({
        title: 'Do you want to verify email address?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire('Saved!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('Contact Saved', 'Email-id not verified', 'success')
        }
        else if (result.isDismissed) {
          this.clearUser();
          Swal.fire('Contact details discarded', '', 'info')
        }
      })
    }
  }

}
