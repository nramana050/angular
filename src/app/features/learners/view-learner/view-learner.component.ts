import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { ILearners } from '../learners.interface';
import { LearnersService } from '../learners.services';
import { ViewLernerStapes } from './view-lerner-stapes';


@Component({
  selector: 'app-view-learner',
  templateUrl: './view-learner.component.html',
  styleUrls: ['./view-learner.component.scss']
})
export class ViewLearnerComponent implements OnInit {

  loggedInUserRole: number;
  user: ILearners;
  refData;
  isLoaded: boolean = false;
  fname:String;

  constructor(
    private readonly learnersService: LearnersService,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly stepperNavigationService:StepperNavigationService,
    private readonly viewLernerStapes: ViewLernerStapes,
  ) {
    this.stepperNavigationService.stepper(this.viewLernerStapes.stepsConfig);   }

  ngOnInit(): void {
    this.stepperNavigationService.stepper(this.viewLernerStapes.stepsConfig);
    this.loggedInUserRole = this.learnersService.resolveLoggedInUserRole();
    this.resolveUser();
  }

  resolveUser() {
    this.getUserRefDataDetails1();
    this.route.queryParams.subscribe((params: any) => {
      const id = params.id;
      this.learnersService.getUserDetails(id).subscribe(userDetails => {
        this.user = userDetails;
        this.isLoaded = true;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }

  getUserRefDataDetails1() {
    this.learnersService.getUserRefDataDetails().subscribe(data => {
      this.refData = data;
    });
  }
}
