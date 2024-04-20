import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceSetupComponent } from './resource-setup.component';

describe('ResourceSetupComponent', () => {
  let component: ResourceSetupComponent;
  let fixture: ComponentFixture<ResourceSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
