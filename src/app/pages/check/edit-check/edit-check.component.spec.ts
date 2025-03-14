import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCheckComponent } from './edit-check.component';

describe('EditCheckComponent', () => {
  let component: EditCheckComponent;
  let fixture: ComponentFixture<EditCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
