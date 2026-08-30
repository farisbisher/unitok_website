import { AfterViewInit, Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';
import { gsap } from '../../core/gsap';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RevealDirective, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements AfterViewInit {
  @ViewChild('hero', { static: true }) heroRef!: ElementRef<HTMLElement>;
  @ViewChildren('parallax') parallaxEls!: QueryList<ElementRef<HTMLElement>>;

  private movers: ((x: number, y: number) => void)[] = [];

  ngAfterViewInit(): void {
    // Depth-ordered: farther/bigger elements drift less, small accents drift more.
    const strengths = [10, 26, 34, 22];

    this.movers = this.parallaxEls.map((ref, i) => {
      const strength = strengths[i] ?? 20;
      const moveX = gsap.quickTo(ref.nativeElement, 'x', { duration: 0.7, ease: 'power3.out' });
      const moveY = gsap.quickTo(ref.nativeElement, 'y', { duration: 0.7, ease: 'power3.out' });
      return (x: number, y: number) => {
        moveX(x * strength);
        moveY(y * strength);
      };
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.heroRef || window.matchMedia('(max-width: 900px)').matches) return;

    const rect = this.heroRef.nativeElement.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;

    this.movers.forEach((move) => move(relX, relY));
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.movers.forEach((move) => move(0, 0));
  }
}
