import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseDetailComponent } from './phase-detail.component';

describe('PhaseDetailComponent', () => {
  let component: PhaseDetailComponent;
  let fixture: ComponentFixture<PhaseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhaseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
