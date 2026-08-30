import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';
import { RevealGroupDirective } from '../../core/reveal-group.directive';
import { WebMockupComponent } from '../../core/web-mockup/web-mockup.component';

interface Solution {
  index: string;
  title: string;
  description: string;
  features: string[];
  link: string;
}

interface Audience {
  icon: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [RevealDirective, RevealGroupDirective, RouterLink, WebMockupComponent],
  templateUrl: './business.component.html',
  styleUrl: './business.component.scss',
})
export class BusinessComponent {
  readonly audiences: Audience[] = [
    { icon: '🏛️', label: 'الجامعات', description: 'وصول مباشر لمجتمعك الطلابي وبرامجه' },
    { icon: '🏢', label: 'الشركات', description: 'اكتشف المواهب وابنِ حضورك الجامعي' },
    { icon: '🏳️', label: 'جهات حكومية', description: 'أطلق مبادراتك ووصّلها للطلاب' },
    { icon: '🤝', label: 'الأندية', description: 'وسّع مجتمعك وزد تفاعل أعضائه' },
    { icon: '📢', label: 'الجهات التجارية', description: 'إطلاق حملات إعلانية تستهدف الطلاب بدقة' },
  ];

  readonly solutions: Solution[] = [
    {
      index: '01',
      title: 'وصّل محتواك للطلاب المناسبين',
      description: 'انشر أخبارك، فعالياتك ومبادراتك أمام جمهور جامعي تحدده حسب الجامعة والتخصص والاهتمامات.',
      features: ['استهدف بدقة حسب الجامعة والتخصص', 'محتواك يظهر داخل تجربة الطالب اليومية', 'تابع الوصول والتفاعل'],
      link: '/business/content',
    },
    {
      index: '02',
      title: 'خل إعلانك يوصل للشخص الصح',
      description: 'أنشئ حملات إعلانية موجهة للطلاب بناءً على معايير دقيقة، ووصّل رسالتك لجمهور يهمك فعلًا.',
      features: ['حملات موجهة بمعايير دقيقة', 'وصول داخل الساحة والمحتوى القصير', 'تقارير أداء واضحة'],
      link: '/business/campaigns',
    },
    {
      index: '03',
      title: 'حوّل مبادرتك إلى تجربة',
      description: 'أطلق برامج وتحديات تفاعلية للطلاب فيها مهام ومستويات ونقاط تشجعهم على المشاركة والاستمرار.',
      features: ['مهام ومستويات ونقاط', 'استهداف حسب الجامعة والفئة', 'متابعة المشاركة والإنجاز'],
      link: '/business/programs',
    },
  ];
}
