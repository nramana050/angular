import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewFavouritesJobsComponent } from './view-favourites-jobs.component';

describe('ViewFavouritesJobsComponent', () => {
  let component: ViewFavouritesJobsComponent;
  let fixture: ComponentFixture<ViewFavouritesJobsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFavouritesJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFavouritesJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
