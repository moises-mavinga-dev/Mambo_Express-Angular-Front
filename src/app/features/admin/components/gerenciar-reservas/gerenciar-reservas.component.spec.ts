import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarResevasComponent } from './gerenciar-reservas.component';

describe('GerenciarResevasComponent', () => {
  let component: GerenciarResevasComponent;
  let fixture: ComponentFixture<GerenciarResevasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarResevasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarResevasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
