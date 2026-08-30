import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';
import { RevealGroupDirective } from '../../core/reveal-group.directive';

interface Metric {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-business-content-page',
  standalone: true,
  imports: [RevealDirective, RevealGroupDirective, RouterLink],
  templateUrl: './business-content-page.component.html',
  styleUrl: '../pages-shared.scss',
})
export class BusinessContentPageComponent {
  readonly targeting = ['الجامعة', 'التخصص', 'الاهتمامات', 'الموقع', 'وغيرها'];

  readonly contentTypes = ['أخبار ومبادرات', 'فعاليات', 'فرص تدريب', 'مسابقات', 'محتوى تثقيفي', 'إعلانات', 'برامج'];

  readonly metrics: Metric[] = [
    { icon: '📡', title: 'الوصول', description: 'كم عدد الطلاب الذين وصلهم المحتوى؟' },
    { icon: '💬', title: 'التفاعل', description: 'كيف تفاعل الطلاب معه؟' },
    { icon: '📊', title: 'الأداء', description: 'ما المحتوى الذي حقق أفضل النتائج؟' },
  ];
}
