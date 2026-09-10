import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Marks admin-authored rich text as safe to render. Angular's HTML sanitizer strips the
 * inline `style` attributes the editor writes for text colours, which would drop the
 * formatting, so this content is trusted as it comes from the admin panel.
 */
@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
