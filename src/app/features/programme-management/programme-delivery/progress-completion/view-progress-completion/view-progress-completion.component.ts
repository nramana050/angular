import { Component, Injector, OnInit } from '@angular/core';
import { ViewProgrammeDeliveryNavigation } from '../../view-programme-delivery/view-programme-delivery-nav';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProgrammeDeliveryService } from '../../programme-delivery.service';
import { CourseSetupService } from 'src/app/features/admin/course-setup/course-setup.service';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { CourseDetails, QualificationStatus } from './view-progress-completion.interface';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { ViewProgressCompletionSteps } from './view-progress-completion-steps';

@Component({
  selector: 'app-view-progress-completion',
  templateUrl: './view-progress-completion.component.html',
  styleUrls: ['./view-progress-completion.component.scss']
})
export class ViewProgressCompletionComponent implements OnInit {
   constructor(
    private readonly viewProgrammeDeliveryNavigation: ViewProgrammeDeliveryNavigation,
    private readonly inPageNavService: InPageNavService,
    private readonly route: ActivatedRoute,
    private readonly stepperNavigationService:StepperNavigationService,
    private readonly viewProgressCompletionSteps: ViewProgressCompletionSteps,
    private readonly router :Router
  ) {
    this.stepperNavigationService.stepper(this.viewProgressCompletionSteps.stepsConfig);
   }

  ngOnInit() {
    this.inPageNavService.setNavItems(this.viewProgrammeDeliveryNavigation.programmeDeliverySubMenu);
    this.route.queryParams.subscribe((params: any) => {
      let deliveryId = params.id
       let programmeName = params.pname
    this.inPageNavService.setNavItems(this.viewProgrammeDeliveryNavigation.programmeDeliverySubMenu);
    this.router.navigate(['./course-details'],{ queryParams :{id:deliveryId,pname:programmeName},relativeTo:this.route})
    }
    )
  }

}
