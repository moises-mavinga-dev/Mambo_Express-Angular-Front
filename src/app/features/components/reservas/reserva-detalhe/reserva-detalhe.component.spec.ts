import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaDetalheComponent } from './reserva-detalhe.component';

describe('ReservaDetalheComponent', () => {
  let component: ReservaDetalheComponent;
  let fixture: ComponentFixture<ReservaDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaDetalheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
