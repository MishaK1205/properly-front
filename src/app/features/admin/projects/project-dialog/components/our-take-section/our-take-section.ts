import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { LANGUAGES } from '../../../../shared/languages';
import { RichTextEditor } from '../../../../shared/rich-text-editor/rich-text-editor';
import { ProjectForm } from '../../project-form';
import { ChipListTabs } from '../chip-list-tabs/chip-list-tabs';

/** "Our Take" section: the write-up and the verification checklist box beside it. */
@Component({
  selector: 'app-our-take-section',
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatIconModule,
    MatTabsModule,
    ChipListTabs,
    RichTextEditor,
  ],
  templateUrl: './our-take-section.html',
  styleUrl: './our-take-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurTakeSection {
  readonly form = input.required<ProjectForm>();
  readonly expandAll = input(false);

  protected readonly languages = LANGUAGES;
  protected readonly expanded = signal(false);
}
