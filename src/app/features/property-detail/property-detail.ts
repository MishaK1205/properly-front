import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { WHATSAPP_URL } from '../../core/data/site.data';
import { ImageService } from '../../core/services/image.service';
import { LanguageService } from '../../core/services/language.service';
import { ProjectService } from '../../core/services/project.service';
import { resolveProjectId } from '../../core/utils/project-slug';
import { SiteFooter } from '../../shared/components/site-footer/site-footer';
import { SiteHeader } from '../../shared/components/site-header/site-header';
import { WhatsappIcon } from '../../shared/components/whatsapp-icon/whatsapp-icon';
import { DetailHero } from './components/detail-hero/detail-hero';
import { DetailSkeleton } from './components/detail-skeleton/detail-skeleton';
import { DeveloperSection } from './components/developer-section/developer-section';
import { InterestForm } from './components/interest-form/interest-form';
import { InvestmentNumbers } from './components/investment-numbers/investment-numbers';
import { KeepExploring } from './components/keep-exploring/keep-exploring';
import { OurTake } from './components/our-take/our-take';
import { PropertyTabs } from './components/property-tabs/property-tabs';
import { buildExploreCards, buildPropertyDetailContent } from './property-detail.mapper';

const RELATED_COUNT = 3;

@Component({
  selector: 'app-property-detail',
  imports: [
    SiteHeader,
    SiteFooter,
    RouterLink,
    DetailHero,
    DetailSkeleton,
    OurTake,
    InvestmentNumbers,
    PropertyTabs,
    DeveloperSection,
    InterestForm,
    KeepExploring,
    WhatsappIcon,
  ],
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyDetail {
  /** Project name slug (or a legacy id) from the route, bound via withComponentInputBinding. */
  readonly slug = input.required<string>();

  private readonly document = inject(DOCUMENT);
  private readonly projectService = inject(ProjectService);
  private readonly images = inject(ImageService);
  private readonly language = inject(LanguageService);

  protected readonly whatsappUrl = WHATSAPP_URL;

  /** Resolves the slug to an id and feeds the "Keep exploring" strip. */
  private readonly projectsResource = rxResource({
    stream: () => this.projectService.getAll(),
  });

  /** Backend id for the current slug; undefined until the list is loaded or if nothing matches. */
  private readonly id = computed(() =>
    resolveProjectId(this.slug(), this.projectsResource.value()),
  );

  /** Stays idle while `id` is undefined, so the detail request only fires once the slug resolves. */
  private readonly projectResource = rxResource({
    params: () => this.id(),
    stream: ({ params }) => this.projectService.getById(params),
  });

  private readonly imageUrl = (imageId: string): string => this.images.imageUrl(imageId);

  protected readonly loading = computed(
    () => this.projectsResource.isLoading() || this.projectResource.isLoading(),
  );
  protected readonly failed = computed(
    () => this.projectsResource.error() !== undefined || this.projectResource.error() !== undefined,
  );

  protected readonly detail = computed(() => {
    const project = this.projectResource.value();
    return project
      ? buildPropertyDetailContent(project, this.language.suffix(), this.imageUrl)
      : undefined;
  });

  /** The next projects in list order, wrapping around, excluding the current one. */
  protected readonly related = computed(() => {
    const projects = this.projectsResource.value() ?? [];
    const index = projects.findIndex((project) => project._id === this.id());
    if (index < 0) {
      return [];
    }
    const next = Array.from(
      { length: Math.min(RELATED_COUNT, projects.length - 1) },
      (_, offset) => projects[(index + offset + 1) % projects.length],
    );
    return buildExploreCards(next, this.language.suffix(), this.imageUrl);
  });

  protected scrollTo(elementId: string): void {
    this.document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
  }
}
