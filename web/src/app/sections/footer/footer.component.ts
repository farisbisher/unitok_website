import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FooterLink {
  label: string;
  path?: string;
  fragment?: string;
  href?: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly columns: FooterColumn[] = [
    {
      title: 'استكشف',
      links: [
        { label: 'الساحة', path: '/', fragment: 'features' },
        { label: 'المجتمعات', path: '/', fragment: 'features' },
        { label: 'البرامج', path: '/', fragment: 'features' },
        { label: 'الفرص', path: '/', fragment: 'features' },
        { label: 'السفراء', path: '/', fragment: 'features' },
      ],
    },
    {
      title: 'يونيتوك الأعمال',
      links: [
        { label: 'المحتوى', path: '/business/content' },
        { label: 'الحملات الإعلانية', path: '/business/campaigns' },
        { label: 'البرامج', path: '/business/programs' },
      ],
    },
    {
      title: 'الشركة',
      links: [
        { label: 'عن يونيتوك', path: '/', fragment: 'hero' },
        { label: 'تواصل معنا', href: 'mailto:contact@unitokapp.com' },
        { label: 'سياسة الخصوصية', path: '/', fragment: 'hero' },
        { label: 'الشروط والأحكام', path: '/', fragment: 'hero' },
      ],
    },
  ];

  readonly year = new Date().getFullYear();
}
