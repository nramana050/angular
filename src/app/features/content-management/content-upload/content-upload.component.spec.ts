import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentUploadComponent } from './content-upload.component';

describe('EditContentUploadComponent', () => {
  let component: ContentUploadComponent;
  let fixture: ComponentFixture<ContentUploadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
