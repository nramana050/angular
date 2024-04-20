import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { map, toArray } from 'rxjs/operators';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ApplicationSetupService } from '../../application-setup.service';


@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.scss']
})
export class ViewRoleComponent implements OnInit {

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
    private readonly router: Router
   ) {

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
      this.roleId = params.id;
      this.applicationSetupService.getRoleDetails(this.roleId).subscribe(roleDetails => {
         this.roleConfiguration=roleDetails.roleConfiguration;
         this.prepareTableData();
         this.displayedColumnsNew = this.getDisplayColumns();
        // this.displayedColumns = ['featureName', ...this.getUniqueOperations()];
        this.rbacPermissions=roleDetails.rbacPermissions;
        this.roleDetails=roleDetails.roleDetails;
        this.userNames=roleDetails.userNames
        this.isLoaded = true;        
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }

  getRoleRefDataDetails() {
    this.applicationSetupService.getRoleRefData().subscribe(data => {
      this.refData = data;
    });
  }

  onEditClick(id: number) {
    this.router.navigate([`/application-setup/role-creation/add-roles`], { queryParamsHandling: 'merge', queryParams: { id: id } });
  }

  displyColumns(i){
    return this.displayedColumnsNew[i];
  }
}