import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainBlockerComponent } from './domain-blocker.component';

describe('DomainBlockerComponent', () => {
  let component: DomainBlockerComponent;
  let fixture: ComponentFixture<DomainBlockerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainBlockerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainBlockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
