import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMakeComponent } from './create-make.component';

describe('CreateMakeComponent', () => {
  let component: CreateMakeComponent;
  let fixture: ComponentFixture<CreateMakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMakeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
