import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { map, toArray } from 'rxjs/operators';
import { ApplicationSetupService } from '../../application-setup.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { AddRoleSteps } from '../add-roles.steps';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ApplicationSetupNavigation } from '../../application-setup-nav';
import { RoleCreationService } from '../role-creation.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  

roleDetails : any;
roleDescription : any;
roleConfiguration:any;
refData;
dataSource = [];
rbacPermissions:any;
displayedColumns: string[];
fIds : any[];
isLoaded: boolean = false;
dataSourceArray : any = [];
roleId;
featureOperations : any;
userNames:any;
displayedColumnsNew:any;


  constructor( 
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly applicationSetupService: ApplicationSetupService,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly addRoleSteps: AddRoleSteps,
    private readonly inPageNavService: InPageNavService,
    private readonly router: Router,
    private readonly appSetupNavigation: ApplicationSetupNavigation,
    private readonly roleCreationService: RoleCreationService
   ) {
    this.stepperNavigationService.stepper(this.addRoleSteps.stepsConfig);
   }
ngOnInit() {
  this.resolveRole();
}

rows:any = []
prepareTableData(){
     from(this.roleConfiguration).pipe(map((res,i)=> {
          if( res['featureOperations']) return { title : res['featureDTO'].featureName, dataSource : res['featureOperations'].map( op=> { return {'featureName': op.fid, 'featureOperations' : res['featureOperations']}})} 
    }), toArray()).subscribe( res=>{
        this.dataSourceArray = res;  
    })  
}

getUniqueOperations(): string[] {
  const uniqueOperations: Set<number> = new Set();
  this.roleConfiguration.forEach((config) => {
    config.featureOperations.forEach((operation) => {
      operation.opId.forEach((opId: number) => {
        uniqueOperations.add(opId);
      });
    });
  });
  return Array.from(uniqueOperations).map((opId) => 'op' + opId);  
}

getDisplayColumns(){
  let arr = []
  for (const feature of this.roleConfiguration) {
    let operations = [];
    for (const featureOperation of feature.featureOperations) {
      for (const opIds of featureOperation.opId) {
          if(!operations.includes('op' +opIds)) operations.push('op' + opIds)
      }
    }
    arr.push(['featureName', ...operations])
  }
  return arr;
}

isOperationAvailable(element: any, opId: string): any {
  if (element && element.featureOperations && opId){
    const operationId = Number(opId.substr(2));
    for (const operation of  element.featureOperations) {
      if( operation.fid == element.featureName){
        return operation.opId.includes(operationId)
      }
    }  
  }
  }

  resolveRole() {
    this.getRoleRefDataDetails();
    this.route.queryParams.subscribe((params: any) => {
      if (!params.id) {
        this.router.navigateByUrl('/application-setup/role-creation/add-roles');
      }
      else {
        this.roleId = params.id;
        this.applicationSetupService.getRoleDetails(this.roleId).subscribe(roleDetails => {
          this.roleConfiguration = roleDetails.roleConfiguration;
          this.prepareTableData();
          this.displayedColumnsNew = this.getDisplayColumns();
          //this.displayedColumns = ['featureName', ...this.getUniqueOperations()];
          this.rbacPermissions = roleDetails.rbacPermissions;
          this.roleDetails = roleDetails.roleDetails;
          this.userNames = roleDetails.userNames
          this.isLoaded = true;
        }, error => {
          this.snackBarService.error(error.error.applicationMessage);
        })
        this.addRoleSteps.stepsConfig.forEach((element, i)=>{
          if(i>3)
           { 
            element.enable = true
          }
          else{
            element.enable = false
          }
          
        })
      }

    })
  }

  getRoleRefDataDetails() {
    this.applicationSetupService.getRoleRefData().subscribe(data => {
      this.refData = data;
    });
  }

  submit(){
    this.roleCreationService.activateRole(this.roleId).subscribe(resp => {
      this.router.navigate([`/application-setup/role-creation`]);
      this.snackBarService.success(resp.message.applicationMessage);
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }
  displyColumns(i){
    return this.displayedColumnsNew[i];
  }
}
