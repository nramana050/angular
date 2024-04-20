import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RwsContentManagenemtComponent } from './rws-content-management.component';

describe('RwsContentManagenemtComponent', () => {
  let component: RwsContentManagenemtComponent;
  let fixture: ComponentFixture<RwsContentManagenemtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RwsContentManagenemtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RwsContentManagenemtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
