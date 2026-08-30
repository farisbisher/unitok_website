import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { gsap, ScrollTrigger } from './gsap';

/**
 * Subtly shrinks a sticky card as the next one in the stack arrives and covers it —
 * the "receding" depth cue from thmanyah's plan-card stack, not just a flat swap.
 */
@Directive({
  selector: '[uStackDepth]',
  standalone: true,
})
export class StackDepthDirective implements AfterViewInit, OnDestroy {
  private tween?: gsap.core.Tween;
  private trigger?: ScrollTrigger;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    // `node` (sticky, unscaled) is only the scroll-position reference. GSAP must never
    // transform the same element it measures for a scrubbed ScrollTrigger — doing so
    // feeds a resize-observed rect change back into the trigger's own math every tick,
    // which runs away into a scroll position that keeps drifting on its own. Scaling
    // this inner child instead keeps the outer sticky box's geometry stable.
    const node = this.el.nativeElement;
    const target = node.firstElementChild as HTMLElement | null;
    if (!target) return;

    const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 84;

    this.tween = gsap.fromTo(
      target,
      { scale: 1 },
      {
        scale: 0.94,
        ease: 'none',
        scrollTrigger: {
          trigger: node,
          start: `top top+=${navHeight}`,
          end: `bottom top+=${navHeight}`,
          scrub: true,
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
