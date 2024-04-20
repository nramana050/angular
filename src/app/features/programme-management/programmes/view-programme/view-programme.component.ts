import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CourseSetupService } from 'src/app/features/admin/course-setup/course-setup.service';
import { ProviderSetupService } from 'src/app/features/admin/provider-setup/provider-setup.service';
import { QualificationSetupService } from 'src/app/features/admin/qualification-setup/qualification-setup.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ProgrammesService } from '../programmes.service';

@Component({
  selector: 'app-view-programme',
  templateUrl: './view-programme.component.html',
  styleUrls: ['./view-programme.component.scss']
})
export class ViewProgrammeComponent implements OnInit {

  programmeDetails: any;
  providerList: any = [];
  courseList: any;
  qualificationList: any;
  isLoaded = false;
  userId;

  constructor(private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly providerSetupService: ProviderSetupService,
    private readonly courseService: CourseSetupService,
    private readonly programService: ProgrammesService,
    private readonly qualificationSetupService: QualificationSetupService,
    private readonly router: Router,
  ) {
  }

  ngOnInit(): void {
    this.resolveRefData();
  }

  resolveProgramme() {
    this.route.queryParams.subscribe((params: any) => {
      this.userId = params.id;
      this.programService.getProgrammeDetails(this.userId).subscribe(programmeDetails => {
        this.programmeDetails = programmeDetails;
        this.isLoaded = true;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }

  resolveRefData() {
    forkJoin([
      this.providerSetupService.getAllProviders(),
      this.courseService.getAllCourses(),
      this.qualificationSetupService.getAllQualification()
    ]).subscribe(data => {
      this.providerList = data[0],
        this.courseList = data[1];
      this.qualificationList = data[2];
      this.resolveProgramme();

    })
  }
}
