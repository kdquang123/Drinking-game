import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayLayout } from './play-layout';

describe('PlayLayout', () => {
  let component: PlayLayout;
  let fixture: ComponentFixture<PlayLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
