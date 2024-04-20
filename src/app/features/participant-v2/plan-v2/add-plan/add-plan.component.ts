import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanV2Service } from '../plan-v2.service';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss']
})
export class AddPlanComponent implements OnInit {

  profileUrl;
  contracts: any[] = [];
  fname: any;
  userId: any;
  assessmentTemplateId:any;
  assessmentName:any;
  assessmentData:any;
  planForm: FormGroup;
  ilpAssesment:any
  constructor(
    private readonly dailogRef: MatDialogRef<AddPlanComponent>,
    private readonly participantV2Service: PlanV2Service,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly learnersService: LearnersService,
    private readonly dialog: MatDialog,
    private fb: FormBuilder
  ) { 
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    this.setTitle();
    this.getassessmentes();
    this.getContracts();
  }

  ngOnInit(): void {
    this.planForm = this.fb.group({
      planType: ['',[Validators.required]],
      contractId:['',[Validators.required]]
    });
  }

  setTitle() {
    this._route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
        this.userId = params.id;
      }
    });
  }

  getassessmentes(){
    this.participantV2Service.getassessments(this.userId,'uw_plan').subscribe(data => {
      this.assessmentData = data;
    })
  }


  onSubmit(): void {
    const selectedOption = this.planForm.get('planType').value;
    const selectedContract = this.planForm.get('contractId').value;
    selectedOption.serviceUserId=this.userId;
    this._router.navigate([this.profileUrl+`/plan-v2/edit-plan`], { queryParamsHandling: 'merge', queryParams: { id: this.userId ,tp_id:selectedOption.assessmentTemplateId,a_type:selectedOption.assessmentType,contractId: selectedContract} });
    this.dailogRef.close();
  }

  dialogClose(): void {
    this.dailogRef.close();
  }

  getContracts() {
    this.participantV2Service.getContractsForUser(this.userId).subscribe((contracts) => {
      this.contracts = contracts; 
    });
  }

}
