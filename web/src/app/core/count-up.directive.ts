import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { gsap, ScrollTrigger } from './gsap';

/** Counts a number up from 0 to its target once it scrolls into view, once. */
@Directive({
  selector: '[uCountUp]',
  standalone: true,
})
export class CountUpDirective implements AfterViewInit, OnDestroy {
  @Input('uCountUp') target = 0;
  @Input() uCountUpPrefix = '';
  @Input() uCountUpDuration = 1.6;

  private tween?: gsap.core.Tween;
  private trigger?: ScrollTrigger;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    const counter = { value: 0 };

    this.tween = gsap.to(counter, {
      value: this.target,
      duration: this.uCountUpDuration,
      ease: 'power2.out',
      onUpdate: () => {
        node.textContent = this.uCountUpPrefix + Math.round(counter.value).toLocaleString('en-US');
      },
      scrollTrigger: {
        trigger: node,
        start: 'top 85%',
        once: true,
      },
    });

    this.trigger = this.tween.scrollTrigger;
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
    this.tween?.kill();
  }
}
