import { Component } from '@angular/core';
import { FeatureSplitComponent } from '../../core/feature-split/feature-split.component';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [FeatureSplitComponent],
  templateUrl: './programs.component.html',
})
export class ProgramsComponent {}
