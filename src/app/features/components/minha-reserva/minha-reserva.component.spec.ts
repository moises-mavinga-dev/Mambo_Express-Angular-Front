import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhaReservaComponent } from './minha-reserva.component';

describe('MinhaReservaComponent', () => {
  let component: MinhaReservaComponent;
  let fixture: ComponentFixture<MinhaReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhaReservaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinhaReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
