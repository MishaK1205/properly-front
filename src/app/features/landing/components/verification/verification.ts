import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { AGENT, VERIFICATION_CHECKS, VERIFICATION_NOTE } from '../../landing.data';
import { AgentCard } from './agent-card/agent-card';

@Component({
  selector: 'app-verification',
  imports: [AgentCard, ScrollRevealDirective],
  templateUrl: './verification.html',
  styleUrl: './verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Verification {
  protected readonly checks = VERIFICATION_CHECKS;
  protected readonly note = VERIFICATION_NOTE;
  protected readonly agent = AGENT;
}
