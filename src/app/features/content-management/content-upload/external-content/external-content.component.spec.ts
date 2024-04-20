import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExternalContentComponent } from './external-content.component';

describe('ExternalContentComponent', () => {
  let component: ExternalContentComponent;
  let fixture: ComponentFixture<ExternalContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
