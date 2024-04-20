import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadExternalContentComponent } from './upload-external-content.component';

describe('UploadExternalContentComponent', () => {
  let component: UploadExternalContentComponent;
  let fixture: ComponentFixture<UploadExternalContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadExternalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadExternalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
