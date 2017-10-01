import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPhaseComponent } from './new-phase.component';

describe('NewPhaseComponent', () => {
  let component: NewPhaseComponent;
  let fixture: ComponentFixture<NewPhaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPhaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
