import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinkFurtherInformationComponent } from './clink-further-information.component';

describe('FurtherInformationComponent', () => {
  let component: ClinkFurtherInformationComponent;
  let fixture: ComponentFixture<ClinkFurtherInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinkFurtherInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinkFurtherInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
