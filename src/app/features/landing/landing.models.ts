export interface YieldStat {
  readonly city: string;
  readonly value: string;
  /** Bar width as a percentage of the widest bar. */
  readonly barPercent: number;
  readonly highlight: boolean;
}

export type ProcessStepIcon = 'search' | 'clipboard' | 'chat';

export interface ProcessStep {
  readonly icon: ProcessStepIcon;
  readonly title: string;
  readonly description: string;
}

export interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}

export interface Agent {
  readonly name: string;
  readonly role: string;
  readonly bio: string;
  readonly photoUrl: string;
  readonly whatsappUrl: string;
}
