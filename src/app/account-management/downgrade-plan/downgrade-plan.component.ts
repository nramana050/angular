import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { GetSelectedProductService } from '../ServiceOfService/get-selected-product.service';
import { AccountServicesService } from '../account-services/account-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-downgrade-plan',
  templateUrl: './downgrade-plan.component.html',
  styleUrls: ['./downgrade-plan.component.css']
})
export class DowngradePlanComponent implements OnInit {

  currentPlans: any = {};
  downgradePlans: any = {};
  oldPlan: any = [];
  newPlan: any = [];
  savePlan: any = {};

  planData: any = {
    factSubscriptionSkey: "",
    productPriceSkey: "",
    productCode: "",
    customerId: ""
  };
  oldName: any;
  newName: any;
  newProdType: any;
  oldProdType: any;

  constructor(private router: Router, private getSelectedProductService: GetSelectedProductService, private accountServicesService: AccountServicesService) { }

  ngOnInit(): void {
    if (this.getSelectedProductService.getSelectedProdDetails == null || this.getSelectedProductService.getSelectedProdDetails == undefined || this.getSelectedProductService.getSelectedProdDetails.productCode == undefined) {
      this.router.navigate(['/overview']);
    }
    else {
      this.currentPlans = this.getSelectedProductService.getSelectedProdDetails;
      this.downgradePlans = this.getSelectedProductService.getselectedPlan;

      this.showPlan();

    }
  }

  showPlan() {
    this.oldPlan = [];
    this.newPlan = [];
    this.oldPlan = this.downgradePlans;
    this.newPlan = this.currentPlans;
    // console.log(this.oldPlan,"juh");
    // console.log(this.newPlan,"jhg");
    if (this.oldPlan != null && this.oldPlan != '' && this.oldPlan != undefined) {
      if (this.oldPlan.dimProduct.subProduct == 'MAIN') {
        this.oldName = this.oldPlan.dimProduct.productName;
      }
      else if (this.oldPlan.dimProduct.subProduct != 'MAIN') {
        this.oldName = this.oldPlan.dimProduct.subProduct;
      }
      this.oldProdType = this.oldPlan.dimProduct.productType;
    }

    if (this.newPlan != null && this.newPlan != '' && this.newPlan != undefined) {
      if (this.newPlan.subProduct == 'MAIN') {
        this.newName = this.newPlan.productName;
      }
      else if (this.newPlan.subProduct != 'MAIN') {
        this.newName = this.newPlan.subProduct;
      }
      this.newProdType = this.newPlan.productType;
    }
  }

  downgradePlan() {
    this.savePlan = {};
    this.savePlan.productCode = this.currentPlans.productCode;
    this.savePlan.productPriceSkey = this.currentPlans.dimProductPrice.productPriceSkey;
    this.savePlan.factSubscriptionSkey = this.oldPlan.factSubscriptionSkey;
    this.savePlan.customerId = sessionStorage.getItem("customerId")
    this.planData = this.savePlan;
    Swal.fire({
      title: 'Downgrade Plan',
      text: "Are you sure to downgrade your existing plan?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        let resp = this.accountServicesService.checkActivity(this.planData);
        resp.subscribe(data => {
          if (data != 0) {
            //this.subscriptionCron();
            // console.log('hi');
          }

        });
        Swal.fire({
          title: 'Request submitted successfully, it is in progress',
          footer: 'Note: Kindly check activity page to track the status'
        })
        this.router.navigate(['/overview']);
      }
    })

  }



  onclick() {
    Swal.fire({
      text: 'We received your request for downgrade but as per our system your contacts are more than ex. 50k ,Please reduce the contacts to get this downgrade in effect',
      footer: 'Note: Kindly check activity section to know the status'
    })
  }

  subscriptionCron() {
    let resp = this.accountServicesService.subscriptionCron();
    resp.subscribe(data => {
      // console.log(data, "cron");

    });
  }

  redirectToOver(){
    this.router.navigate(['/overview']);
  }

}
