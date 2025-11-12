import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacoteCardComponent } from './pacote-card.component';

describe('PacoteCardComponent', () => {
  let component: PacoteCardComponent;
  let fixture: ComponentFixture<PacoteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacoteCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacoteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
