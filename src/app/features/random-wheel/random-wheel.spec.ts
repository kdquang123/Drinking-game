import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RandomWheel } from './random-wheel';

describe('RandomWheel', () => {
  let component: RandomWheel;
  let fixture: ComponentFixture<RandomWheel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomWheel],
    }).compileComponents();

    fixture = TestBed.createComponent(RandomWheel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
