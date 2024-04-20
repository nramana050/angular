import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProfessionalDocumentComponent } from './upload-professional-document.component';

describe('UploadProfessionalDocumentComponent', () => {
  let component: UploadProfessionalDocumentComponent;
  let fixture: ComponentFixture<UploadProfessionalDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadProfessionalDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProfessionalDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
