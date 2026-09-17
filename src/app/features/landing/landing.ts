import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { WHATSAPP_URL } from '../../core/data/site.data';
import { ProjectResponse } from '../../core/models/api.models';
import { ProjectService } from '../../core/services/project.service';
import { SiteFooter } from '../../shared/components/site-footer/site-footer';
import { SiteHeader } from '../../shared/components/site-header/site-header';
import { WhatsappFab } from '../../shared/components/whatsapp-fab/whatsapp-fab';
import { Faq } from './components/faq/faq';
import { Hero } from './components/hero/hero';
import { HowItWorks } from './components/how-it-works/how-it-works';
import { LeadForm } from './components/lead-form/lead-form';
import { MarketCase } from './components/market-case/market-case';
import { Shortlist } from './components/shortlist/shortlist';
import { Verification } from './components/verification/verification';

@Component({
  selector: 'app-landing',
  imports: [
    SiteHeader,
    Hero,
    MarketCase,
    Shortlist,
    HowItWorks,
    Verification,
    Faq,
    LeadForm,
    SiteFooter,
    WhatsappFab,
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {
  private readonly document = inject(DOCUMENT);
  private readonly projectService = inject(ProjectService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly projects = signal<readonly ProjectResponse[]>([]);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);

  protected readonly projectNames = computed(() =>
    this.projects().map((project) => project.projectName),
  );
  protected readonly whatsappUrl = WHATSAPP_URL;

  protected readonly selectedProject = signal('');

  constructor() {
    // This page is prerendered, so the live project list is only fetched in the browser.
    if (this.isBrowser) {
      this.loadProjects();
    }
  }

  protected loadProjects(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.failed.set(true);
      },
    });
  }

  protected onInterested(projectName: string): void {
    this.selectedProject.set(projectName);
    this.scrollTo('contact');
  }

  protected scrollTo(id: string): void {
    this.document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
