import { Component } from '@angular/core';
import { RevealDirective } from '../../core/reveal.directive';
import { RevealGroupDirective } from '../../core/reveal-group.directive';

interface TeamMember {
  name: string;
  role: string;
  photo?: string;
  experiences: string[];
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [RevealDirective, RevealGroupDirective],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent {
  // NOTE: `experiences` are placeholder copy until real bios are provided —
  // swap these out, and add `photo` for members once their headshots are in.
  readonly members: TeamMember[] = [
    {
      name: 'فارس بشر',
      role: 'Co-Founder & CEO',
      photo: 'assets/images/team/faris-bisher.jpg',
      experiences: [
        'قاد يونيتوك من الفكرة إلى منصة فعلية يستخدمها الطلاب.',
        'خبرة في بناء المنتجات الرقمية وريادة الأعمال.',
        'يركز على الرؤية العامة والشراكات الاستراتيجية.',
      ],
    },
    {
      name: 'محمد أبوخريبة',
      role: 'Chief Commercial Officer — CCO',
      photo: 'assets/images/team/mohammed-abu-khurayba.jpg',
      experiences: [
        'خبرة واسعة في التطوير التجاري وبناء الشراكات.',
        'يقود علاقات يونيتوك مع الجهات والشركاء.',
        'ركز مسيرته على نمو الأعمال والتوسع في السوق.',
      ],
    },
    {
      name: 'تسنيم الحطامي',
      role: 'Chief Creative Officer — CCO',
      experiences: [
        'تقود الهوية البصرية وتجربة المستخدم في يونيتوك.',
        'خبرة في التصميم الرقمي وبناء المنتجات من الصفر.',
        'تهتم بأدق تفاصيل التجربة، من الفكرة إلى الواجهة.',
      ],
    },
    {
      name: 'لجين عياش',
      role: 'Founding Full Stack Engineer',
      experiences: [
        'تبني الأنظمة الخلفية وواجهات يونيتوك التقنية.',
        'خبرة في تطوير المنتجات الرقمية من الصفر.',
        'تهتم بجودة الكود وقابلية التوسع.',
      ],
    },
    {
      name: 'رنا إيهاب',
      role: 'Founding Front End Engineer',
      experiences: [
        'تبني واجهات يونيتوك وتجربة الاستخدام داخل التطبيق.',
        'خبرة في تطوير واجهات تفاعلية وسلسة.',
        'تهتم بالتفاصيل البصرية وأداء الواجهة.',
      ],
    },
    {
      name: 'أروى غيلان',
      role: 'R&D Researcher',
      experiences: [
        'تدعم يونيتوك بالأبحاث والدراسات المعمّقة.',
        'تحلل احتياجات المستخدمين لتطوير المنصة.',
        'تهتم بربط البيانات بقرارات المنتج.',
      ],
    },
  ];
}
