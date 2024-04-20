import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVirtualCampusInfoComponent } from './view-virtual-campus-info.component';

describe('ViewVirtualCampusInfoComponent', () => {
  let component: ViewVirtualCampusInfoComponent;
  let fixture: ComponentFixture<ViewVirtualCampusInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVirtualCampusInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVirtualCampusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
