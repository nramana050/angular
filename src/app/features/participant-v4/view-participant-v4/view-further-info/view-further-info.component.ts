import { isDataSource } from '@angular/cdk/collections';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaptrLearnersService } from 'src/app/features/captr-learners/captr-learners.services';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { ILearners } from 'src/app/features/learners/learners.interface';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { SessionsService } from 'src/app/sessions/sessions.service';
import { ParticipantV4Service } from '../../participant-v4.service';



@Component({
  selector: 'app-view-further-info',
  templateUrl: './view-further-info.component.html',
  styleUrls: ['./view-further-info.component.scss']
})
export class ViewFurtherInfoComponent implements OnInit, OnDestroy {

  loggedInUserRole: number;
  user: ILearners;
  fname:string;
  refData;
  allData;
  isLoaded: boolean = false;
  furtherInfo:any;
  isAuthorized = false;
  profileUrl;
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear()));
  supportIdList =[];
  supportArea=[];
  documentArea=[];
  documentIdList=[];

  constructor(
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly paticipantV4Service :ParticipantV4Service,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly sessionService: SessionsService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly participantV4Service: ParticipantV4Service,
  ) {    
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
      this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu); 
      this.participantV4Service.getUserRefDataDetails().subscribe(data => {
        this.refData = data;
      })
      this.participantV4Service.getRefDataAllDetails().subscribe(data => {
        this.allData = data;        
      })
         this.setTitle();
  }

  ngOnInit(): void {
    this.loggedInUserRole = this.paticipantV4Service.resolveLoggedInUserRole();
    this.isAuthorized = this.sessionService.hasResource(['9','3']);
    this.resolveUser();
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
  }

  resolveUser() {
    this.getUserRefDataDetails1();
    this.route.queryParams.subscribe((params: any) => {
      const id = params.id;
      this.paticipantV4Service.getUserDetails(id).subscribe(userDetails => {
        this.user = userDetails;
        this.isLoaded = true;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
      this.paticipantV4Service.getFurtherInfo(id).subscribe(userDetails => {
        this.furtherInfo=userDetails;
        this.getSupportId(this.furtherInfo.externalSupports?.externalSupportList)        
        this.getIdList(this.furtherInfo.idAndDocuments?.idAndDocumentList)        
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }

  getUserRefDataDetails1() {
    this.paticipantV4Service.getFurtherInfoRefData().subscribe(data => {
      this.refData = data;
      this.supportArea =this.refData.supportArea
      this.documentArea = this.refData.document      
    });
    this.paticipantV4Service.getRefDataAllDetails().subscribe(data => {   
      this.allData = data;
    });
  }

  isAuthorize(fid) {
    return this.sessionService.hasResource([fid.toString()])
  }

  Authorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }

  getSupportId(ids){ 
    if(ids !== null){
      ids.forEach(element => {
       const filterChoiceList = this.supportArea.filter(choice => choice.id === element.supportAreaId);
        const choiceList = filterChoiceList[0];
        if(choiceList){
          this.supportIdList.push(choiceList.value)
        }
      });
    }
  }
  getIdList(ids){ 
    if(ids !== null){
      ids.forEach(element => {
       const filterChoiceList = this.documentArea.filter(choice => choice.id === element.documentId);
        const choiceList = filterChoiceList[0];
        if(choiceList){
          this.documentIdList.push(choiceList.value)
        }
      });
    }
  }

}

