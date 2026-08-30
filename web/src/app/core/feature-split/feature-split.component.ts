import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../reveal.directive';
import { MediaPlaceholderComponent } from '../media-placeholder/media-placeholder.component';
import { StackDepthDirective } from '../stack-depth.directive';

export interface FeatureChip {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-feature-split',
  standalone: true,
  imports: [RevealDirective, MediaPlaceholderComponent, RouterLink, StackDepthDirective],
  templateUrl: './feature-split.component.html',
  styleUrl: './feature-split.component.scss',
})
export class FeatureSplitComponent implements OnChanges, OnDestroy {
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() description = '';
  @Input() accent: 'amaranth' | 'teal' | 'carrot' | 'dusk' | 'emerald' = 'amaranth';
  @Input() reverse = false;
  @Input() ctaLabel?: string;
  @Input() ctaLink?: string;
  @Input() chips: FeatureChip[] = [];
  @Input() placeholderLabel = 'لقطة من التطبيق';
  @Input() videoSrc?: string;
  @Input() images: string[] = [];
  @Input() isLast = false;

  activeImageIndex = 0;
  private rotateTimer?: ReturnType<typeof setInterval>;

  ngOnChanges(): void {
    clearInterval(this.rotateTimer);
    this.activeImageIndex = 0;

    if (this.images.length > 1) {
      this.rotateTimer = setInterval(() => {
        this.activeImageIndex = (this.activeImageIndex + 1) % this.images.length;
      }, 3200);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.rotateTimer);
  }
}
