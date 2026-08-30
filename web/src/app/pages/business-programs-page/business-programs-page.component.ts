import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';
import { RevealGroupDirective } from '../../core/reveal-group.directive';
import { WebMockupComponent } from '../../core/web-mockup/web-mockup.component';

@Component({
  selector: 'app-business-programs-page',
  standalone: true,
  imports: [RevealDirective, RevealGroupDirective, RouterLink, WebMockupComponent],
  templateUrl: './business-programs-page.component.html',
  styleUrl: '../pages-shared.scss',
})
export class BusinessProgramsPageComponent {
  readonly building = ['مستويات', 'مهام', 'تحديات', 'نقاط', 'صملة'];
}
