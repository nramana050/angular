import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCertificatesListComponent } from './upload-certificates-list.component';

describe('UploadCertificatesListComponent', () => {
  let component: UploadCertificatesListComponent;
  let fixture: ComponentFixture<UploadCertificatesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCertificatesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCertificatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
