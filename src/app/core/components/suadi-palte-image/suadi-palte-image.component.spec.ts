import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuadiPalteImageComponent } from './suadi-palte-image.component';

describe('SuadiPalteImageComponent', () => {
  let component: SuadiPalteImageComponent;
  let fixture: ComponentFixture<SuadiPalteImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuadiPalteImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuadiPalteImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
