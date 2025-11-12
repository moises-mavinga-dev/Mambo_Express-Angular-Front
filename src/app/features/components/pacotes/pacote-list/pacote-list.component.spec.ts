import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacoteListComponent } from './pacote-list.component';

describe('PacoteListComponent', () => {
  let component: PacoteListComponent;
  let fixture: ComponentFixture<PacoteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacoteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
