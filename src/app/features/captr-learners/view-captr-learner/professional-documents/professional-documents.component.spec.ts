import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalDocumentsComponent } from './professional-documents.component';

describe('ProfessionalDocumentsComponent', () => {
  let component: ProfessionalDocumentsComponent;
  let fixture: ComponentFixture<ProfessionalDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionalDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
