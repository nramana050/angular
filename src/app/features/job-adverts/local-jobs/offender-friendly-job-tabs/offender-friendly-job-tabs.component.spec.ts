import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OffenderFriendlyJobTabsComponent } from './offender-friendly-job-tabs.component';

describe('OffenderFriendlyJobTabsComponent', () => {
  let component: OffenderFriendlyJobTabsComponent;
  let fixture: ComponentFixture<OffenderFriendlyJobTabsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OffenderFriendlyJobTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffenderFriendlyJobTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
