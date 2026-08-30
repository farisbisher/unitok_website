import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { gsap, ScrollTrigger } from './gsap';

/**
 * Staggers the reveal of an element's direct children as the group scrolls into view.
 * Used for card grids (ecosystem, business capabilities) instead of revealing each card individually.
 */
@Directive({
  selector: '[uRevealGroup]',
  standalone: true,
})
export class RevealGroupDirective implements AfterViewInit, OnDestroy {
  @Input() uRevealStagger = 0.12;
  @Input() uRevealGroupSelector = ':scope > *';

  private trigger?: ScrollTrigger;
  private tween?: gsap.core.Tween;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const children = this.el.nativeElement.querySelectorAll(this.uRevealGroupSelector);
    if (!children.length) return;

    this.tween = gsap.fromTo(
      children,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: this.uRevealStagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.el.nativeElement,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          fastScrollEnd: true,
        },
      },
    );

    this.trigger = this.tween.scrollTrigger;
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
    this.tween?.kill();
  }
}
