import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardFlip } from './card-flip';

describe('CardFlip', () => {
  let component: CardFlip;
  let fixture: ComponentFixture<CardFlip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardFlip],
    }).compileComponents();

    fixture = TestBed.createComponent(CardFlip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
