import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the 390px app frame', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const frame = (fixture.nativeElement as HTMLElement).querySelector('.app-frame');
    expect(frame).toBeTruthy();
  });
});
