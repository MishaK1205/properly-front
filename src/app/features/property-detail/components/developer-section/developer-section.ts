import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PropertyDetailContent } from '../../property-detail.models';

@Component({
  selector: 'app-developer-section',
  templateUrl: './developer-section.html',
  styleUrl: './developer-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperSection {
  readonly detail = input.required<PropertyDetailContent>();
}
