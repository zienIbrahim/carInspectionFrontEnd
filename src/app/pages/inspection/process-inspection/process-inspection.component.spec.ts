import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessInspectionComponent } from './process-inspection.component';

describe('ProcessInspectionComponent', () => {
  let component: ProcessInspectionComponent;
  let fixture: ComponentFixture<ProcessInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessInspectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
