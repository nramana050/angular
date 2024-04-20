import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditContentCategoryComponent } from './edit-content-category.component';

describe('EditContentCategoryComponent', () => {
  let component: EditContentCategoryComponent;
  let fixture: ComponentFixture<EditContentCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContentCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContentCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
