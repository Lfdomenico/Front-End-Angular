import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Agendamento } from './agendamento';

describe('Agendamento', () => {
  let component: Agendamento;
  let fixture: ComponentFixture<Agendamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Agendamento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Agendamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
