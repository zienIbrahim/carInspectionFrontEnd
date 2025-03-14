import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTechnicianComponent } from './edit-technician.component';

describe('EditTechnicianComponent', () => {
  let component: EditTechnicianComponent;
  let fixture: ComponentFixture<EditTechnicianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTechnicianComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTechnicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
