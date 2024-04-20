import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FavouritesJobsComponent } from './favourites-jobs.component';

describe('FavouritesJobsComponent', () => {
  let component: FavouritesJobsComponent;
  let fixture: ComponentFixture<FavouritesJobsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouritesJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouritesJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
