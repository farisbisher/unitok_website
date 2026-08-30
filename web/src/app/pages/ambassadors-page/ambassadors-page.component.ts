import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';
import { RevealGroupDirective } from '../../core/reveal-group.directive';
import { PhoneMockupComponent } from '../../core/phone-mockup/phone-mockup.component';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-ambassadors-page',
  standalone: true,
  imports: [RevealDirective, RevealGroupDirective, RouterLink, PhoneMockupComponent],
  templateUrl: './ambassadors-page.component.html',
  styleUrl: '../pages-shared.scss',
})
export class AmbassadorsPageComponent {
  readonly benefits: Benefit[] = [
    {
      icon: '✨',
      title: 'فرص حصرية',
      description: 'فرص وتجارب مخصصة لسفراء يونيتوك.',
    },
    {
      icon: '💎',
      title: 'مزايا خاصة بالسفراء',
      description: 'مزايا لا تكون متاحة للجميع، وتختلف حسب مستواك في البرنامج.',
    },
    {
      icon: '📄',
      title: 'خبرة تضيفها لسيرتك',
      description: 'تجربة عملية في بناء المجتمع، التواصل، التسويق والمشاركة.',
    },
    {
      icon: '💼',
      title: 'فرص مهنية',
      description: 'إمكانية الوصول إلى فرص تدريب، وظائف وتجارب مهنية تقدمها الجهات والشركات الشريكة.',
    },
    {
      icon: '🎉',
      title: 'فعاليات وتجارب',
      description: 'مشاركة في فعاليات، لقاءات ومبادرات مخصصة للسفراء.',
    },
    {
      icon: '📈',
      title: 'تطورك داخل البرنامج',
      description: 'كلما تطورت، تزيد مسؤولياتك وتكبر الفرص والمزايا اللي تقدر تحصل عليها.',
    },
  ];
}
