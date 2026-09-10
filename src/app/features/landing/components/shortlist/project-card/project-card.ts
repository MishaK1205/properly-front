import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProjectResponse } from '../../../../../core/models/api.models';
import { ImageService } from '../../../../../core/services/image.service';
import { LanguageService } from '../../../../../core/services/language.service';
import { Button } from '../../../../../shared/components/button/button';
import { SafeHtmlPipe } from '../../../../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-project-card',
  imports: [Button, RouterLink, SafeHtmlPipe],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  readonly project = input.required<ProjectResponse>();

  readonly interested = output<string>();

  private readonly images = inject(ImageService);
  private readonly language = inject(LanguageService);

  protected readonly imageUrl = computed(() => {
    const [cover] = this.project().projectImages;
    return cover ? this.images.imageUrl(cover) : null;
  });

  protected readonly companyName = computed(() => this.project().companyInfo?.companyName ?? '');

  protected readonly location = computed(() => {
    const project = this.project();
    return (
      this.language.localize({
        Ge: project.projectLocationGe,
        En: project.projectLocationEn,
        Ru: project.projectLocationRu,
      }) ?? ''
    );
  });

  protected readonly advantages = computed(() => {
    const project = this.project();
    return (
      this.language.localize({
        Ge: project.projectAdvantagesGe,
        En: project.projectAdvantagesEn,
        Ru: project.projectAdvantagesRu,
      }) ?? []
    );
  });

  protected readonly shortDescription = computed(() => {
    const description = this.project().projectDescription;
    return (
      this.language.localize({
        Ge: description?.projectShortDescriptionGe,
        En: description?.projectShortDescriptionEn,
        Ru: description?.projectShortDescriptionRu,
      }) ?? ''
    );
  });

  protected readonly mapsUrl = computed(() => {
    const { projectLatitude, projectLongitude } = this.project();
    return `https://www.google.com/maps/search/?api=1&query=${projectLatitude},${projectLongitude}`;
  });
}
