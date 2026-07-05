import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-whatsapp-icon',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.24133 17.7038C3.40062 18.1056 3.43609 18.5459 3.34317 18.9681L2.18942 22.5322C2.11383 22.8997 2.23378 23.2802 2.50647 23.5379C2.77917 23.7956 3.16578 23.8938 3.52842 23.7976L7.22583 22.7164C7.62419 22.6374 8.03674 22.6719 8.41642 22.8161C13.1923 25.0464 18.8803 23.5156 21.8917 19.1895C24.903 14.8634 24.3636 8.99769 20.6137 5.29337C16.8639 1.58904 10.9921 1.1213 6.70306 4.18527C2.41406 7.24924 0.952832 12.9555 3.24133 17.7038"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
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
export class WhatsappIcon {
  readonly size = input(26);
}
