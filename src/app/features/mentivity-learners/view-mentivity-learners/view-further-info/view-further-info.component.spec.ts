import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFurtherInfoComponent } from './view-further-info.component';

describe('ViewFurtherInfoComponent', () => {
  let component: ViewFurtherInfoComponent;
  let fixture: ComponentFixture<ViewFurtherInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFurtherInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFurtherInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
