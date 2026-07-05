import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ButtonLink } from '../../../../../shared/components/button-link/button-link';
import { WhatsappIcon } from '../../../../../shared/components/whatsapp-icon/whatsapp-icon';
import { Agent } from '../../../landing.models';

@Component({
  selector: 'app-agent-card',
  imports: [ButtonLink, NgOptimizedImage, WhatsappIcon],
  templateUrl: './agent-card.html',
  styleUrl: './agent-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCard {
  readonly agent = input.required<Agent>();

  protected readonly whatsappLabel = computed(
    () => `Chat with ${this.agent().name.split(' ')[0]} on WhatsApp`,
  );
}
