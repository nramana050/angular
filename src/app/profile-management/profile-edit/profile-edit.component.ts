// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { ProfileServicesService } from '../profile-services/profile-services.service';
import swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { ConatctServicesService } from 'src/app/contact-management/contact-management-service/conatct-services.service';

declare var $: any
const Toast = swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', swal.stopTimer)
    toast.addEventListener('mouseleave', swal.resumeTimer)
  }
})

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  btnName: string = "Edit"
  editMode = 0;
  customerId: any;
  customerSkey: any;
  imageUpload: any;
  ImageSource: any;
  itrationCount = false;


  // FORM FIELDS
  userInfo: any = {
    firstName: "",
    lastName: "",
    mobileNumber: "",
    companyName: "",
    designation: "",
    emailAddress: "",
    mobileCountryCode: "",
  };
  mobilecodeList: any;
  pause = false;

  constructor(private profileServicesService: ProfileServicesService, private sanitizer: DomSanitizer, private conatctServicesService: ConatctServicesService) {
  }

  ngOnInit(): void {
    this.customerSkey = sessionStorage.getItem("customerSkey");
    this.customerId = sessionStorage.getItem("customerId");
    this.getProfileDetails();
    this.getProfileImage(this.customerSkey);
    this.mobileCountryCode();
    this.pauseFlag();
  }

  //UPLOAD IMAGE
  imageFile() {
    let element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
    element.click();
  }

  getProfileDetails() {
    if (sessionStorage.getItem("customerId") != null && sessionStorage.getItem("customerId") != undefined) {
      let resp = this.profileServicesService.getProfileDetails(sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        this.userInfo = data;
      })
    }
  }

  // EDIT/UPDATE BUTTON TOGGLE 
  isShowDiv = false;
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
    if (this.isShowDiv) {
      this.btnName = "Update";
    }
    else {
      this.btnName = "Edit";
    }
  }

  //UPLOAD IMAGE
  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (file.type == "image/jpeg" || file.type == "image/png") {
      if (file.size <= 2000000) {
        this.itrationCount = true;
        let resp = this.profileServicesService.uploadProfilePic(file);
        resp.subscribe(data => {
          this.getProfileImage(this.customerSkey);
          this.profileServicesService.setMessage("hi");
          this.itrationCount = false;
        });
      } else {
        swal.fire("Please upload less than 2 mb");
      }
    }
    else {
      swal.fire("Please upload .jpeg or .png");

    }

  }

  getProfileImage(customerSkey) {
    var reader = new FileReader();
    this.itrationCount = true;
    let resp = this.profileServicesService.getProfileImage(customerSkey);
    resp
      .subscribe((baseImage: any) => {
        if (baseImage != null && baseImage.profileImage != null && baseImage.profileImage != "") {
          let objectURL = 'data:profileImage/jpeg;base64,' + baseImage.profileImage;
          this.ImageSource = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.itrationCount = false;
        } else {
          this.itrationCount = false;
          this.ImageSource = "assets/images/avtar.png";
        }
      });
  }

  // form submit 
  saveUser(editProfileForm: NgForm) {
    if (this.isShowDiv) {
      let resp = this.profileServicesService.saveProfileDetails(this.userInfo);
      resp.subscribe(data => {
        if (data == 1 || data == '1') {
          this.getProfileDetails();
          this.profileServicesService.setMessage("hi");
          Toast.fire({
            icon: 'success',
            title: 'Profile updated succesfully '
          })
        }
        else {
          Toast.fire({
            icon: 'error',
            title: 'Updation failed '
          })
        }
      })
    }
    this.toggleDisplayDiv();
  }

  mobileCountryCode() {
    let resp = this.conatctServicesService.mobileCountryCode()
    resp.subscribe(data => {
      this.mobilecodeList = data;
    });
  }

  pauseFlag() {
    let resp = this.profileServicesService.getCurrentSubscriptionDetails(sessionStorage.getItem("customerId"));
    resp.subscribe(data => {
      if (data != null) {
        // console.log(data);
        if (data.pauseSubscription == "Y" ) {
          this.pause = true;
        }
        else {
          this.pause = false;
        }
      }
    });
  }


}
