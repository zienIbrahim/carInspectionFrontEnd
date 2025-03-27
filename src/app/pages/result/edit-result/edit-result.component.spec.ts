import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditResultComponent } from './edit-result.component';

describe('EditResultComponent', () => {
  let component: EditResultComponent;
  let fixture: ComponentFixture<EditResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
