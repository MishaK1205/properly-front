import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Button } from '../../../../../shared/components/button/button';
import { Agent } from '../../../landing.models';

@Component({
  selector: 'app-agent-card',
  imports: [Button, NgOptimizedImage],
  templateUrl: './agent-card.html',
  styleUrl: './agent-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCard {
  readonly agent = input.required<Agent>();
}
