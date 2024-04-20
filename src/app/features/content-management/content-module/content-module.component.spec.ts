import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentModuleComponent } from './content-module.component';

describe('ContentLaunchComponent', () => {
  let component: ContentModuleComponent;
  let fixture: ComponentFixture<ContentModuleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
