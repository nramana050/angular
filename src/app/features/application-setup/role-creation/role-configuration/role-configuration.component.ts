import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { AddRoleSteps } from '../add-roles.steps';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ApplicationSetupNavigation } from '../../application-setup-nav';
import { filter, map, toArray } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ApplicationSetupService } from '../../application-setup.service';
import { RoleCreationService } from '../role-creation.service'
import { Router } from '@angular/router';
import { MatCheckbox } from '@angular/material/checkbox';


@Component({
  selector: 'app-role-configuration',
  templateUrl: './role-configuration.component.html',
  styleUrls: ['./role-configuration.component.scss']
})
export class RoleConfigurationComponent implements OnInit, OnDestroy {

  @ViewChild('checkbox-0-1') checkbox: MatCheckbox;
  panelOpenState = false;
  roleDetails: any;
  roleConfiguration: any = [];
  editConfiguration: any = [];
  dataSourceArray: any = [];
  displayedColumns: string[];
  displayedColumnsNew:any;
  fIds: any[];
  roleId;
  refData;
  finalJson: any;
  validationError: string;
  isDisable = true
  selectAll: any = [];
  disableSubmitButton: boolean = true;
  showTable = false;
  roleDetail: any;
  editConfigurationData : any;

  constructor(
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly addRoleSteps: AddRoleSteps,
    private readonly inPageNavService: InPageNavService,
    private readonly appSetupNavigation: ApplicationSetupNavigation,
    private readonly route: ActivatedRoute,
    private readonly applicationSetupService: ApplicationSetupService,
    private readonly snackBarService: SnackBarService,
    private readonly roleCreationService: RoleCreationService,
    private router: Router
  ) {
    this.stepperNavigationService.stepper(this.addRoleSteps.stepsConfig);

  }

  async ngOnInit() {

    this.editConfiguration = [];
    this.editConfigurationData = [];
    await this.resolveRole()
    await this.editRoleConfiguration()
    this.showTable = true;
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  rows: any = []
  prepareTableData() {
    from(this.roleConfiguration).pipe(map((res, i) => {
      if (res['featureOperations']) return { parentFId:res['featureDTO'].featureId ,title: res['featureDTO'].featureName, dataSource: res['featureOperations'].map(op => { return { 'featureName': op.fid, 'featureOperations': res['featureOperations'] } }) }
    }), toArray()).subscribe(res => {
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
    if (element && element.featureOperations && opId) {
      const operationId = Number(opId.substr(2));
      for (const operation of element.featureOperations) {
        if (operation.fid == element.featureName) {
          return operation.opId.includes(operationId)
        }
      }
    }
  }

  resolveRole() {
    return new Promise(resolve => {
      this.getRoleRefDataDetails();
      this.route.queryParams.subscribe((params: any) => {
        if (!params.id) {
          this.router.navigateByUrl('/application-setup/role-creation/add-roles');
        } else{
          this.roleId = params.id;
          this.addRoleSteps.stepsConfig.forEach((element, i)=>{
            if(i>2)
             { 
              element.enable = true
            }
            else{
              element.enable = false
            }
            
          })
          this.getRoleDetail(params.id);
        }
          
        this.roleCreationService.getConfigurationRefDataDetails(this.roleId).subscribe(roleDetails => {
          this.roleConfiguration = roleDetails;
          this.prepareTableData();
          this.displayedColumnsNew = this.getDisplayColumns();
          // this.displayedColumns = ['featureName', ...this.getUniqueOperations()];
          resolve('');
        }, error => {
          this.snackBarService.error(error.error.applicationMessage);
        })
      })
    })
  }

  getRoleRefDataDetails() {
    this.applicationSetupService.getRoleRefData().subscribe(data => {
      this.refData = data;
    });

  }
  onSubmit() {
    let finalData = [];
    let length = this.editConfigurationData.featureDetails.length;
    for (let i = 0; i < length; i+=1) {  
      if(this.editConfigurationData.featureDetails[i].operations.length == 0){
        this.editConfigurationData.featureDetails.splice(i, 1);
      }
    }
    const payload = this.editConfigurationData;
    this.roleCreationService.createConfiguration(payload).subscribe(
      (resp) => {
            
        this.router.navigate(['/application-setup/role-creation/overview'], { queryParamsHandling: "merge" });
        this.snackBarService.success(resp.message.applicationMessage);
      },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      }
    );
  }

  checkChange(event, element, opId, sourceName) {

    const isFeaturePresent = this.editConfigurationData.featureDetails.some(item => item.featureId === element.featureName);

    if(!isFeaturePresent){
      this.editConfigurationData.featureDetails.push({featureId: element.featureName, operations: [parseInt(opId.match(/\d+/)[0])]})
    }else{
      this.editConfigurationData.featureDetails.forEach( feature => {
        if(element.featureName == feature.featureId){
          if (event.checked == true) {
            if(!feature.operations.includes(parseInt(opId.match(/\d+/)[0]))){
              feature.operations.push(parseInt(opId.match(/\d+/)[0]));
            }
          } else { 
            let index = feature.operations.indexOf((parseInt(opId.match(/\d+/)[0])));
            if (index !== -1) {
              feature.operations.splice(index, 1);
            }
          }
        }
      })
    }
    
    this.roleConfiguration.forEach((feature, fIndex) => {

      if (feature.featureDTO.featureName === sourceName) {
        feature.featureOperations.forEach((operation, oIndex) => {
          if (element.featureName === operation.fid) {
            let operationObj = this.roleConfiguration[fIndex].featureOperations[oIndex];
            if (!operationObj.tempOpIds) {
              this.roleConfiguration[fIndex].featureOperations[oIndex]['tempOpIds'] = []
            }
            if (event.checked == true) {
              this.roleConfiguration[fIndex].featureOperations[oIndex]['tempOpIds'].push(parseInt(opId.match(/\d+/)[0]))
            } else {
              let index = this.roleConfiguration[fIndex].featureOperations[oIndex]['tempOpIds'].indexOf((parseInt(opId.match(/\d+/)[0])));
              if (index !== -1) {
                this.roleConfiguration[fIndex].featureOperations[oIndex]['tempOpIds'].splice(index, 1);
              }
            }
          }
        });
      }
    });
    this.updateSubmitButtonStatus();
  }
  updateSubmitButtonStatus() {
    let isDisable = false;
    for (const dataSource of this.dataSourceArray) {
      let subFeatureLength = dataSource.dataSource.length
      let tempUnselectedOpearationFeature = [];
      for (const element of dataSource.dataSource) { 
        for (const iterator of element.featureOperations) {
          if ((iterator.tempOpIds &&  iterator.tempOpIds.length == 0 && !tempUnselectedOpearationFeature.includes(iterator.fid)) ||
          (!iterator.tempOpIds && !tempUnselectedOpearationFeature.includes(iterator.fid))) {
            tempUnselectedOpearationFeature.push(iterator.fid)
            subFeatureLength--;
           
            if( subFeatureLength==0 ){
              isDisable = true;
              break;
            }
          }
        }
      }
     
      if(  tempUnselectedOpearationFeature.includes(dataSource.parentFId)){
      isDisable = true;
      }
    }
    this.disableSubmitButton = isDisable;
  }

  selectAllCheckboxes(tableIndex) {
    this.selectAll[tableIndex] = !this.selectAll[tableIndex] || false;
    let dataSourceLen = this.dataSourceArray.length;
    for (let i = 0; i < dataSourceLen; i += 1) {
      if (i === tableIndex) {
        for (const element of this.dataSourceArray[i].dataSource) {
          for (const opId of this.displyColumns(i)) {
            if (this.isOperationAvailable(element, opId)) {
              element['fid' + element.featureName + opId] = this.selectAll[tableIndex];
              element.featureOperations.forEach(feature => {
                feature['tempOpIds'] = this.selectAll[tableIndex] ? [...feature['opId']] : [];
              });
            }
          }
        }
      }
    }
   
    if(this.selectAll[tableIndex]){
      let datasourceData = JSON.parse(JSON.stringify(this.dataSourceArray[tableIndex].dataSource[0].featureOperations))
      let dataSourceLength = datasourceData.length;
      for (let i = 0; i < dataSourceLength; i+=1) {
        if(this.editConfigurationData.featureDetails.some(item => item.featureId === datasourceData[i].fid)){
          this.editConfigurationData.featureDetails.forEach((feature, fIndex) => {
            if(feature.featureId == datasourceData[i].fid) this.editConfigurationData.featureDetails[fIndex].operations = datasourceData[i].opId;
          });
        }else{
          this.editConfigurationData.featureDetails.push({featureId: datasourceData[i].fid, operations: datasourceData[i].opId})
        }         
      }
    }else{
      
      let datasourceData = JSON.parse(JSON.stringify(this.dataSourceArray[tableIndex].dataSource[0].featureOperations))
      let dataSourceLength = datasourceData.length;
      for (let i = 0; i < dataSourceLength; i+=1) {
        this.editConfigurationData.featureDetails.forEach((feature, fIndex) => {
          if(feature.featureId == datasourceData[i].fid){
            this.editConfigurationData.featureDetails.splice(fIndex,1);
          } 
        });    
      }  
    }
    this.updateSubmitButtonStatus();
  }

  editRoleConfiguration() {
    return new Promise(resolve => {
      this.route.queryParams.subscribe((params: any) => {
        this.roleId = params.id;
        this.roleCreationService.getRoleConfigDetails(this.roleId).subscribe(editRole => {
          let activeEditFeatures = []
          for (const role of editRole.featureDetails) {
              for (const refRole of this.roleConfiguration) {
                for (const feature of refRole.featureOperations) {
                  if(role.featureId == feature.fid){
                    activeEditFeatures.push(role);
                  }
                }
              }
          }
          editRole.featureDetails = activeEditFeatures;  
          this.editConfiguration = JSON.parse(JSON.stringify(editRole));
          this.editConfigurationData = JSON.parse(JSON.stringify(editRole));
          from(this.dataSourceArray).pipe(
            map((dataSource: any, dataSourceIndex: any) => dataSource.dataSource.map((feature: any, featureIndex: any) => feature.featureOperations.map((operation: any, operationIndex: any) => operation.opId.map((opIds: any, opIdsIndex: any) => {
              for (let i = 0; i < this.editConfiguration.featureDetails.length; i++) {
                if (this.editConfiguration.featureDetails[i].featureId === operation.fid && this.editConfiguration.featureDetails[i].operations.includes(opIds)) {
                  operation['tempOpIds'] = this.editConfiguration.featureDetails[i].operations;
                  if (operation['tempOpIds'].includes(opIds)) {
                    feature[`fid${operation.fid}op${opIds}`] = true;
                  }
                }
              }
            }))))).subscribe(
          );
          this.updateSubmitButtonStatus();
          resolve('');
        }, error => {
          this.snackBarService.error(error.error.applicationMessage);
        })
      })
    })
  }

  getRoleDetail(roleId: number) {
    this.roleCreationService.getRoleDetails(roleId).subscribe(data => {
      this.roleDetail = data;
      if(data.isCompleted){
        this.addRoleSteps.stepsConfig.forEach(element=>{
          element.enable = false
        })
      }
    })
  }

  displyColumns(i){
    return this.displayedColumnsNew[i];
  }
}



