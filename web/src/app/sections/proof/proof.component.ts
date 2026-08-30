import { Component } from '@angular/core';
import { RevealDirective } from '../../core/reveal.directive';
import { RevealGroupDirective } from '../../core/reveal-group.directive';
import { CountUpDirective } from '../../core/count-up.directive';

interface Stat {
  target: number;
  label: string;
}

interface UniversityLogo {
  name: string;
  src: string;
}

@Component({
  selector: 'app-proof',
  standalone: true,
  imports: [RevealDirective, RevealGroupDirective, CountUpDirective],
  templateUrl: './proof.component.html',
  styleUrl: './proof.component.scss',
})
export class ProofComponent {
  readonly stats: Stat[] = [
    { target: 50, label: 'جامعة' },
    { target: 1000, label: 'مستخدم' },
    { target: 500, label: 'منشور' },
    { target: 50, label: 'فرصة منشورة' },
  ];

  // Real partner-university marks. Add more here as logo files come in.
  readonly universities: UniversityLogo[] = [
    { name: 'جامعة الملك فهد للبترول والمعادن', src: 'assets/images/universities/kfupm.svg' },
    { name: 'جامعة الأميرة نورة', src: 'assets/images/universities/pnu.svg' },
    { name: 'جامعة طيبة', src: 'assets/images/universities/tu.svg' },
    { name: 'جامعة الأمير سلطان', src: 'assets/images/universities/psu.svg' },
    { name: 'جامعة الملك عبدالعزيز', src: 'assets/images/universities/kau.svg' },
    { name: 'جامعة الملك فيصل', src: 'assets/images/universities/kfu.svg' },
    { name: 'جامعة الملك خالد', src: 'assets/images/universities/kku.svg' },
    { name: 'جامعة الملك عبدالله للعلوم والتقنية', src: 'assets/images/universities/kaust.svg' },
    { name: 'جامعة الملك سعود', src: 'assets/images/universities/ksu.svg' },
    { name: 'جامعة جازان', src: 'assets/images/universities/jazan.svg' },
    { name: 'الجامعة الإسلامية بالمدينة المنورة', src: 'assets/images/universities/iu-medinah.svg' },
    { name: 'جامعة الأمير سطام بن عبدالعزيز', src: 'assets/images/universities/prince-sattam.svg' },
    { name: 'جامعة القصيم', src: 'assets/images/universities/qu.svg' },
    { name: 'جامعة تبوك', src: 'assets/images/universities/tabuk.svg' },
    { name: 'جامعة أم القرى', src: 'assets/images/universities/uqu.svg' },
    { name: 'جامعة نجران', src: 'assets/images/universities/najran.svg' },
    { name: 'جامعة الإمام عبدالرحمن بن فيصل', src: 'assets/images/universities/iau.svg' },
    { name: 'جامعة الجوف', src: 'assets/images/universities/ju.svg' },
  ];
}
