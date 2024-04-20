import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressCompletionComponent } from './progress-completion.component';

describe('ProgressCompletionComponent', () => {
  let component: ProgressCompletionComponent;
  let fixture: ComponentFixture<ProgressCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressCompletionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
