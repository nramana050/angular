import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTabsComponent } from './view-tabs.component';

describe('ViewTabsComponent', () => {
  let component: ViewTabsComponent;
  let fixture: ComponentFixture<ViewTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
