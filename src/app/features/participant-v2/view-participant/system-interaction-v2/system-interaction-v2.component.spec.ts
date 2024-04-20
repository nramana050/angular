import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemInteractionV2Component } from './system-interaction-v2.component';

describe('SystemInteractionV2Component', () => {
  let component: SystemInteractionV2Component;
  let fixture: ComponentFixture<SystemInteractionV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemInteractionV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemInteractionV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
