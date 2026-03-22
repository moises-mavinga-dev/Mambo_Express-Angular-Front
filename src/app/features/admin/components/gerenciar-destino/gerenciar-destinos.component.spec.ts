import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarDestinoComponent } from './gerenciar-destinos.component';

describe('GerenciarDestinoComponent', () => {
  let component: GerenciarDestinoComponent;
  let fixture: ComponentFixture<GerenciarDestinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarDestinoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarDestinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
