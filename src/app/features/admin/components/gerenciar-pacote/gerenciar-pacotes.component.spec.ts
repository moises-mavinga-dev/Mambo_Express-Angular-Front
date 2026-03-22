import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarPacoteComponent } from './gerenciar-pacotes.component';

describe('GerenciarPacoteComponent', () => {
  let component: GerenciarPacoteComponent;
  let fixture: ComponentFixture<GerenciarPacoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarPacoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarPacoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
