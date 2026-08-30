import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-media-placeholder',
  standalone: true,
  templateUrl: './media-placeholder.component.html',
  styles: [':host { display: block; width: 100%; height: 100%; }'],
})
export class MediaPlaceholderComponent {
  @Input() label = 'ضع الصورة هنا';
}
