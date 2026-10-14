import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardIllo } from './card-illo';

describe('CardIllo', () => {
  let component: CardIllo;
  let fixture: ComponentFixture<CardIllo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardIllo],
    }).compileComponents();

    fixture = TestBed.createComponent(CardIllo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
