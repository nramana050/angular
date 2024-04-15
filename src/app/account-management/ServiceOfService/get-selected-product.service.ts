import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetSelectedProductService {
  selectedProdDetails: any = {};
  currentProduct:any={};
  selectedPlan: any = {};


  constructor() { }

  set setSelectedProdDetails(val: any) {
    this.selectedProdDetails = val;
  }
  get getSelectedProdDetails() {
    return this.selectedProdDetails;
  }

  set setCurrentProduct(val: any) {
    this.currentProduct = val;
  }
  get getCurrentProduct() {
    return this.currentProduct;
  }

  set setselectedPlan(val: object) {
    this.selectedPlan = val;
}
get getselectedPlan() {
    return this.selectedPlan;
}
}
