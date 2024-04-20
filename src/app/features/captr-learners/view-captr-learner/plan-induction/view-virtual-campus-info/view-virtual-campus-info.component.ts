import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utility } from '../../../../../framework/utils/utility';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { LearnerNavigation } from '../../learner-nav';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { MentivityLearnerNavigation } from 'src/app/features/mentivity-learners/view-mentivity-learners/mentivity-learner-nav';

const BASE_PATH = './captr-learner';

@Component({
  selector: 'app-view-virtual-campus-info',
  templateUrl: './view-virtual-campus-info.component.html',
  styleUrls: ['./view-virtual-campus-info.component.scss']
})
export class ViewVirtualCampusInfoComponent implements OnInit {
  fname: any;
  suId: any;
  user: any;
  prn: string;
  dob: any;
  neurodiverganceSelfDeclared=[];
  neurodivergenceSupport =[];
  neurodivergenceAssessed=[];
  splitSelfDeclared=[];
  splitSupport=[];
  splitAssessed=[];
  url;
  readonly MNVTY_URL = 'mentivity-learner';


  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly learnersService: LearnersService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly inPageNavService: InPageNavService,
    private readonly mentivityLearnerNavigation: MentivityLearnerNavigation,

  ) 
  { 
    this.url = this.route.snapshot['_routerState'].url.split("/", 2)[1];   
    if(this.url === this.MNVTY_URL){
      this.inPageNavService.setNavItems(this.mentivityLearnerNavigation.learnerSubMenu);
    }
    else{
      this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    }     this.setTitle();
  }
  
  setTitle(){
    this.route.queryParams.subscribe((params: any) => {
      this.fname = params.name;
      this.suId = params.id;
      this.prn = params.prn
      this.route.snapshot.data['title'] = `${this.fname}`;
      });
    }

  ngOnInit(): void {
    this.getviewVCInfo();
  }

  getviewVCInfo(){
    this.learnersService.viewVCInfo(this.prn).subscribe(data=> {
      this.user = data;
      this.dob = Utility.transformDateToString(this.user.dateOfBirth);
      this.neurodiverganceSelfDeclared = this.user.neurodiverganceSelfDeclared;
        this.splitSelfDeclared = this.neurodiverganceSelfDeclared[0]?.split(',');
      this.neurodivergenceAssessed=this.user.neurodivergenceAssessed;
        this.splitAssessed = this.neurodivergenceAssessed[0]?.split(',');
      this.neurodivergenceSupport =this.user.neurodivergenceSupport;
        this.splitSupport = this.neurodivergenceSupport[0]?.split(',');
    })
  }

  onExitClicked() {
    this.router.navigate([BASE_PATH]);
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

}
