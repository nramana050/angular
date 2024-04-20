import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProgressCompletionComponent } from './view-progress-completion.component';

describe('ViewProgressCompletionComponent', () => {
  let component: ViewProgressCompletionComponent;
  let fixture: ComponentFixture<ViewProgressCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProgressCompletionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProgressCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
