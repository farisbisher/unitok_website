import { Component } from '@angular/core';
import { FeatureSplitComponent } from '../../core/feature-split/feature-split.component';

@Component({
  selector: 'app-ai-feed',
  standalone: true,
  imports: [FeatureSplitComponent],
  templateUrl: './ai-feed.component.html',
  styleUrl: './ai-feed.component.scss',
})
export class AiFeedComponent {}
