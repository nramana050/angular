import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditContentModuleComponent } from './edit-content-module.component';

describe('EditContentModuleComponent', () => {
  let component: EditContentModuleComponent;
  let fixture: ComponentFixture<EditContentModuleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContentModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContentModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
