import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import * as Editor from 'src/app/features/shared/components/ck-editor/ckeditor';
import { CaptrLearnersService } from 'src/app/features/captr-learners/captr-learners.services';
import { ParticipantV6Service } from 'src/app/features/participant-v6/participant-v6.service';
import { ApplicationSetupService } from '../../application-setup.service';
// import {colors} from '../../../../assets/genaieFontColorConfig/FontColorConfig';
// import { MyUploadAdapter } from './custom-ckeditor';

@Component({
  selector: 'app-add-edit-programme-setup',
  templateUrl: './add-edit-programme-setup.component.html',
  styleUrls: ['./add-edit-programme-setup.component.scss']
})
export class AddEditProgrammeSetupComponent implements OnInit {

  // public Editor = Editor;
  editorConfig: any = {
    "placeholder" : "Page details",
    "autoParagraph": false,
    "link": {
      "addTargetToExternalLinks": true,
    },
    removePlugins: [ 'Table','ImageUpload', 'MediaEmbed', 'Link' ],
  }

  routeIntent: string;
  programmeSetupForm: FormGroup;
  url: string | ArrayBuffer;
  fileSelected: boolean = false;
  // selectedFile: File | null = null; 
  refAnswer: any;
  addLogoClicked: boolean = false;
  fileUploaded: boolean = false;
  characterLimit: number = 1000;


  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly participantV6Service: ParticipantV6Service) {
      // this.stepperNavigationService.stepper(this.editCaptrLeanerSteps.stepsConfig);
      this.participantV6Service.getRefAnswer().subscribe(data => {
        this.refAnswer = data;
        this.refAnswer = this.refAnswer.filter(ref => ref.identifier !== 'PNS')
  
      })

    }

  ngOnInit(): void {
    this.resolveRouteIntent();
    this.initOrganisationForm();
  }
  resolveRouteIntent() {
    if (this.activatedRoute.snapshot.data['title'] === 'Edit ProgrammeSetup') {
      this.routeIntent = 'editProgrammeSetup';
    } else {
      this.routeIntent = 'newProgrammeSetup';
    }
  }
  initOrganisationForm() {
    this.programmeSetupForm = this.fb.group({
      id: '',
      contract: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      usefulLinksTab: [null],
      programmeName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      nationalContent: [null],
      nationalAssessments:[null],
      primaryColor: ['', [Validators.pattern(/^#([0-9A-Fa-f]{3}){1,2}$/)]],
      secondaryColor:['', [Validators.pattern(/^#([0-9A-Fa-f]{3}){1,2}$/), this.secondaryColorValidator]],
      addLogo: [null, Validators.required],
      editorControl: ['', Validators.required]
      
  
    });
    this.programmeSetupForm.get('editorControl').valueChanges.subscribe(value => {
      const characterCount = this.getCharacterCount(value);
      if (characterCount > this.characterLimit) {
        this.programmeSetupForm.get('editorControl').setErrors({ characterLimitExceeded: true });
      } else {
        this.programmeSetupForm.get('editorControl').setErrors(null);
      }
    });
  
  }

  getCharacterCount(value: string): number {
    if (!value) return 0;

  // Remove HTML tags
  const plainText = value.replace(/<[^>]*>/g, '');

  return plainText.length;
}

  secondaryColorValidator(control: AbstractControl): ValidationErrors | null {
    const primaryColor = control.parent?.get('primaryColor')?.value;
    const secondaryColor = control.value;
    
    // If both colors are not empty and are the same, return an error
    return primaryColor && secondaryColor && primaryColor === secondaryColor ? { colorsMatch: true } : null;
  }
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); 

      reader.onload = (event) => { 
        this.url = event.target.result;
        this.fileSelected = true;
        console.log("File selected:", this.fileSelected);
        
      }
    }
  }
  removeLogo() {
    this.url = ''; 
    this.fileSelected = false;
    console.log("File selected:", this.fileSelected);
  }



  
}  



