import { Component } from '@angular/core';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-final-cta',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './final-cta.component.html',
  styleUrl: './final-cta.component.scss',
})
export class FinalCtaComponent {}
