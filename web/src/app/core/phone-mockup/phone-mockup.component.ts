import { Component } from '@angular/core';

@Component({
  selector: 'app-phone-mockup',
  standalone: true,
  templateUrl: './phone-mockup.component.html',
  styleUrl: './phone-mockup.component.scss',
  host: { style: 'display: block; width: 100%; max-width: 300px;' },
})
export class PhoneMockupComponent {}
