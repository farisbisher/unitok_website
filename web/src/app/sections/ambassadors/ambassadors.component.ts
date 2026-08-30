import { Component } from '@angular/core';
import { FeatureSplitComponent } from '../../core/feature-split/feature-split.component';

@Component({
  selector: 'app-ambassadors',
  standalone: true,
  imports: [FeatureSplitComponent],
  templateUrl: './ambassadors.component.html',
})
export class AmbassadorsComponent {}
