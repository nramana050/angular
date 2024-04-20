import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditKeywordComponent } from './edit-keyword.component';

describe('EditKeywordComponent', () => {
  let component: EditKeywordComponent;
  let fixture: ComponentFixture<EditKeywordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditKeywordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditKeywordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
