import { Component } from '@angular/core';
import { Card } from './components/card/card';

@Component({
  imports: [Card],
  selector: 'app-card-flip',
  styleUrl: './card-flip.css',
  templateUrl: './card-flip.html',
})
export class CardFlip {}
