import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ProjectSectionId, ProjectStep } from '../../project-sections';

/** The dialog's step rail: picks which section of the property page is being edited. */
@Component({
  selector: 'app-section-nav',
  imports: [MatIconModule],
  templateUrl: './section-nav.html',
  styleUrl: './section-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionNav {
  readonly steps = input.required<readonly ProjectStep[]>();

  readonly selected = output<ProjectSectionId>();
}
