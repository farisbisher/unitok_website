import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';
import { RevealGroupDirective } from '../../core/reveal-group.directive';

@Component({
  selector: 'app-business-campaigns-page',
  standalone: true,
  imports: [RevealDirective, RevealGroupDirective, RouterLink],
  templateUrl: './business-campaigns-page.component.html',
  styleUrl: '../pages-shared.scss',
})
export class BusinessCampaignsPageComponent {
  readonly targeting = ['الجامعة', 'التخصص', 'الاهتمامات', 'الموقع', 'ومعايير أخرى'];
}
