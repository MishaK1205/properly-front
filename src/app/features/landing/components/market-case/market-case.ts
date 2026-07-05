import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { ACCESS_POINTS, MARKET_QUOTE, YIELD_STATS } from '../../landing.data';
import { StatCard } from './stat-card/stat-card';

@Component({
  selector: 'app-market-case',
  imports: [SectionHeading, StatCard],
  templateUrl: './market-case.html',
  styleUrl: './market-case.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketCase {
  protected readonly yieldStats = YIELD_STATS;
  protected readonly accessPoints = ACCESS_POINTS;
  protected readonly quote = MARKET_QUOTE;
}
