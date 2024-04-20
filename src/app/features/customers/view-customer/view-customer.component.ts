import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { ICustomer } from '../customer.interface';
import { Location } from '@angular/common';
import { CustomersService } from '../customers.service';
import { FormGroup } from '@angular/forms';
import { ImageUrl } from '../../../framework/constants/image--url-constant';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.scss']
})
export class ViewCustomerComponent implements OnInit {

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly snackBarService: SnackBarService,
    private readonly customerService: CustomersService) {
        this.customerService.getRefDomains().subscribe(data => {
          this.refDomain = data;
        })
  }

  customer: any;
  customerForm: FormGroup;
  imageSource;
  selectedKwMainFeatureId;
  allFeaturesKw: any[];
  allSubFeaturesKw = [];
  KwSuFeaturesSubFeatures;
  searchDataKw = {
    keyword: ''
  };
  kwSubFeaturesList = [];
  selectedSuMainFeatureId;
  allFeaturesSu: any[];
  allSubFeaturesSu = [];
  searchDataSu = {
    keyword: ''
  };
  suSubFeaturesList = [];
  refDomain

  ngOnInit() {
    this.resolveUser();
  }
  resolveUser() {
    this.customerService.getFeaturesSubFeatures().subscribe(data => {
      this.KwSuFeaturesSubFeatures = data;
      this.customerService.getKwFeatures(this.searchDataKw).subscribe(data => {
        this.allFeaturesKw = data;
      })

      this.customerService.getSuFeatures(this.searchDataSu).subscribe(data => {
        this.allFeaturesSu = data;
      })

      this.activatedRoute.params.subscribe((params: any) => {
        const id = params.id;
        this.customerService.getCustomerDetailsById(id).subscribe(customerDetails => {
          this.customer = customerDetails;
          this.selectKwSubFeatures(this.customer?.kwAppDetails?.features[0], 0);
          this.selectSuSubFeatures(this.customer?.suAppDetails?.features[0], 0);
          this.customer.kwAppDetails.logoPath = ImageUrl.IMAGES + this.customer.kwAppDetails.logoPath;
          if (this.customer.suAppDetails) {
            this.customer.suAppDetails.logoPath = ImageUrl.IMAGES + this.customer.suAppDetails.logoPath;
          }
        }, error => {
          this.location.back();
          this.snackBarService.error(error.error.applicationMessage);
        })
      })
    })
  }

  selectKwSubFeatures(feature, kwIndex) {
    this.selectedKwMainFeatureId = feature?.featureId;
    this.onFilterKwSubFeature();
    this.kwSubFeaturesList = this.customer?.kwAppDetails?.features[kwIndex]?.subFeatureIds
  }

  onFilterKwSubFeature() {
    const subFeatures = this.KwSuFeaturesSubFeatures.find(item => item.featureId === this.selectedKwMainFeatureId);
    this.allSubFeaturesKw = subFeatures?.subFeatureIds;
  }

  getFeatureNameByIdKw(featureId: number): string {
    const feature = this.allFeaturesKw.find(item => item.featureId === featureId);
    return feature ? feature.featureName : '';
  }

  getSubFeatureNameByIdKw(featureId: number): string {
    const feature = this.allSubFeaturesKw.find(item => item.featureId === featureId);
    return feature ? feature.featureName : '';
  }

  selectSuSubFeatures(feature, suIndex) {
    this.selectedSuMainFeatureId = feature?.featureId;
    this.onFilterSuSubFeature();
    this.suSubFeaturesList = this.customer?.suAppDetails?.features[suIndex]?.subFeatureIds
  }

  onFilterSuSubFeature() {
    const subFeatures = this.KwSuFeaturesSubFeatures.find(item => item.featureId === this.selectedSuMainFeatureId);
    this.allSubFeaturesSu = subFeatures?.subFeatureIds;
  }

  getFeatureNameByIdSu(featureId: number): string {
    const feature = this.allFeaturesSu.find(item => item.featureId === featureId);
    return feature ? feature.featureName : '';
  }

  getSubFeatureNameByIdSu(featureId: number): string {
    const feature = this.allSubFeaturesSu.find(item => item.featureId === featureId);
    return feature ? feature.featureName : '';
  }
}
