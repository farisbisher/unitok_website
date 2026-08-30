import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { gsap, ScrollTrigger } from './gsap';

/**
 * Fades + slides an element in once it crosses into view, and reverses on scroll back up.
 * Mirrors the reveal choreography used across the section content (thmanyah-subscribe style).
 */
@Directive({
  selector: '[uReveal]',
  standalone: true,
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  @Input('uReveal') delay: number | string = 0;
  @Input() uRevealY = 28;
  @Input() uRevealDuration = 0.9;

  private trigger?: ScrollTrigger;
  private tween?: gsap.core.Tween;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;

    this.tween = gsap.fromTo(
      node,
      { opacity: 0, y: this.uRevealY },
      {
        opacity: 1,
        y: 0,
        duration: this.uRevealDuration,
        delay: typeof this.delay === 'number' ? this.delay : Number(this.delay) || 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: node,
          start: 'top 85%',
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
