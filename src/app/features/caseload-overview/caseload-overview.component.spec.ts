import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseloadOverviewComponent } from './caseload-overview.component';

describe('CaseloadOverviewComponent', () => {
  let component: CaseloadOverviewComponent;
  let fixture: ComponentFixture<CaseloadOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseloadOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseloadOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
