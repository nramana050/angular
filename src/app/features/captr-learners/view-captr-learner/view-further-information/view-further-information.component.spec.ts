import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFurtherInformationComponent } from './view-further-information.component';

describe('ViewFurtherInformationComponent', () => {
  let component: ViewFurtherInformationComponent;
  let fixture: ComponentFixture<ViewFurtherInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFurtherInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFurtherInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
