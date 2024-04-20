import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalContentComponent } from './internal-content.component';

describe('InternalContentComponent', () => {
  let component: InternalContentComponent;
  let fixture: ComponentFixture<InternalContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
