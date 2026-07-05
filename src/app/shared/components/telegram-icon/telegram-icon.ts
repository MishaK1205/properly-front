import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-telegram-icon',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g clip-path="url(#clip0_telegram_icon)">
        <path
          d="M10.902 16.2644C10.9603 16.4099 11.103 16.5037 11.2596 16.4997C11.4163 16.4956 11.5539 16.3947 11.6047 16.2464L16.4797 1.99643C16.5287 1.86077 16.4949 1.70901 16.3929 1.60701C16.2909 1.50502 16.1391 1.47118 16.0035 1.52018L1.75348 6.39518C1.60525 6.44601 1.50426 6.58365 1.50025 6.7403C1.49623 6.89695 1.59005 7.03958 1.73548 7.09793L7.68298 9.48293C8.0629 9.63504 8.36418 9.93578 8.51698 10.3154L10.902 16.2644M16.3905 1.61018L8.18548 9.81443"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_telegram_icon">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TelegramIcon {
  readonly size = input(18);
}
