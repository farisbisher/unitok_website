import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';
import { RevealGroupDirective } from '../../core/reveal-group.directive';
import { WebMockupComponent } from '../../core/web-mockup/web-mockup.component';

interface CardItem {
  icon: string;
  title: string;
  description: string;
}

interface FlowStep {
  index: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-programs-page',
  standalone: true,
  imports: [RevealDirective, RevealGroupDirective, RouterLink, WebMockupComponent],
  templateUrl: './programs-page.component.html',
  styleUrl: '../pages-shared.scss',
})
export class ProgramsPageComponent {
  readonly studentConcepts: CardItem[] = [
    { icon: '🪜', title: 'مستويات', description: 'يتقدم فيها خطوة بخطوة.' },
    { icon: '✅', title: 'مهام', description: 'تساعده على التطبيق والمشاركة.' },
    { icon: '⭐', title: 'نقاط', description: 'تعكس تقدمه وإنجازه.' },
    { icon: '🔥', title: 'صملة', description: 'تحفزه على الاستمرار.' },
    { icon: '🏆', title: 'إنجازات', description: 'تظهر ما حققه خلال رحلته.' },
  ];

  readonly orgSteps: FlowStep[] = [
    {
      index: '01',
      title: 'أنشئ البرنامج',
      description: 'حدد فكرة البرنامج، مراحله، المهام والمحتوى الذي تريد تقديمه.',
    },
    {
      index: '02',
      title: 'وصّل البرنامج',
      description: 'استهدف الطلاب المناسبين حسب الجامعة، التخصص والاهتمامات، ووصل برنامجك إلى الفئة التي تهمك.',
    },
    {
      index: '03',
      title: 'تابع التقدم',
      description: 'تابع مشاركة الطلاب وإنجازهم للمراحل والمهام، واعرف كيف يتفاعلون مع البرنامج.',
    },
    {
      index: '04',
      title: 'قِس الأثر',
      description: 'احصل على صورة أوضح عن أداء البرنامج ومستوى المشاركة والإنجاز.',
    },
  ];

  readonly programTypes: CardItem[] = [
    { icon: '🎓', title: 'البرامج التدريبية', description: 'لتطوير المهارات وربط التعلم بالتطبيق.' },
    { icon: '⛺', title: 'المعسكرات', description: 'لتقديم تجربة تعليمية مقسمة إلى مراحل ومهام.' },
    { icon: '🏁', title: 'المسابقات والتحديات', description: 'لتحفيز الطلاب على المشاركة والتنافس والإنجاز.' },
    { icon: '🔍', title: 'برامج اكتشاف المواهب', description: 'للوصول إلى الطلاب واكتشاف مهاراتهم وقدراتهم.' },
    { icon: '🏛️', title: 'المبادرات الجامعية', description: 'لتقديم تجارب وبرامج مخصصة لطلاب الجامعة.' },
  ];
}
