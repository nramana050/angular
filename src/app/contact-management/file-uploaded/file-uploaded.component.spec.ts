import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadedComponent } from './file-uploaded.component';

describe('FileUploadedComponent', () => {
  let component: FileUploadedComponent;
  let fixture: ComponentFixture<FileUploadedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploadedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
