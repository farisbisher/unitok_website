import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './sections/navbar/navbar.component';
import { FooterComponent } from './sections/footer/footer.component';
import { ScrollTrigger } from './core/gsap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(router: Router) {
    // Route changes swap the DOM without a full reload, so GSAP's cached
    // ScrollTrigger start/end offsets go stale and reveal animations never
    // fire. Force a recalculation once the new page has painted.
    router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const fragment = router.parseUrl(event.urlAfterRedirects).fragment;

        // Angular's own anchorScrolling assumes the target element already
        // exists when its Scroll event fires, but this app's sections mount
        // lazily as the route's component tree renders — so it frequently
        // fires too early and silently scrolls nowhere. Do it ourselves after
        // the new view has painted, matching the timing ScrollTrigger needs
        // below. Instant (not the page's default smooth scroll-behavior)
        // because an animated scroll here races with the ScrollTrigger
        // refresh and can leave the page settled mid-scroll.
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (fragment) {
            document.getElementById(fragment)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
          } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }

          ScrollTrigger.refresh();
        }));
      });
  }
}
