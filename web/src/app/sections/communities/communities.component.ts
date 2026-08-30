import { Component } from '@angular/core';
import { FeatureSplitComponent } from '../../core/feature-split/feature-split.component';

@Component({
  selector: 'app-communities',
  standalone: true,
  imports: [FeatureSplitComponent],
  templateUrl: './communities.component.html',
})
export class CommunitiesComponent {}
