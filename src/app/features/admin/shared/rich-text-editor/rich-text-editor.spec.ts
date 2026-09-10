import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { RichTextEditor } from './rich-text-editor';

const CARD_HTML = '<h3>Location</h3><p>Historic centre, Mtskheta</p>';

/** The editor is always used inside an admin form, where a stray Enter would submit it. */
@Component({
  imports: [ReactiveFormsModule, RichTextEditor],
  template: `<form (ngSubmit)="submitted = true">
    <app-rich-text-editor label="Content" [formControl]="control" />
  </form>`,
})
class Host {
  readonly control = new FormControl(CARD_HTML, { nonNullable: true });
  submitted = false;
}

function tick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 10));
}

/** Quill is imported lazily after the first render, so the editor only exists a few ticks later. */
async function editorBody(fixture: ComponentFixture<Host>): Promise<HTMLElement> {
  for (let attempt = 0; attempt < 100; attempt++) {
    const body = fixture.nativeElement.querySelector('.ql-editor') as HTMLElement | null;
    if (body) {
      return body;
    }
    await tick();
  }
  throw new Error('The editor did not load.');
}

/** Quill picks up edits through a mutation observer, which reports them on the next tick. */
function edit(body: HTMLElement, html: string): Promise<void> {
  body.innerHTML = html;
  return tick();
}

/** Selects every word the way a click and drag would, so toolbar formats have a target. */
async function selectAll(body: HTMLElement): Promise<void> {
  body.focus();
  const range = document.createRange();
  range.selectNodeContents(body);
  const selection = document.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  await tick();
}

function control(fixture: ComponentFixture<Host>, selector: string): HTMLInputElement {
  return fixture.nativeElement.querySelector(selector) as HTMLInputElement;
}

async function enter(input: HTMLInputElement, value: string): Promise<void> {
  input.value = value;
  input.dispatchEvent(new Event('change'));
  await tick();
}

/** The colour panels are rendered in a CDK overlay, so they live outside the fixture. */
async function openColors(
  fixture: ComponentFixture<Host>,
  kind: 'text' | 'highlight',
): Promise<HTMLElement> {
  const triggers = fixture.nativeElement.querySelectorAll('.color-control__trigger');
  (triggers[kind === 'text' ? 0 : 1] as HTMLButtonElement).click();
  await tick();
  const panels = document.querySelectorAll('.color-control__panel');
  return panels[panels.length - 1] as HTMLElement;
}

/** Types a hex value and confirms it the way a user does, with the Enter key. */
async function typeHex(panel: HTMLElement, value: string): Promise<KeyboardEvent> {
  const input = panel.querySelector('.color-control__hex input') as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('input'));
  const key = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
  input.dispatchEvent(key);
  await tick();
  return key;
}

describe('RichTextEditor', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.inject(OverlayContainer).ngOnDestroy();
  });

  it('shows the control value without marking the form dirty', async () => {
    const body = await editorBody(fixture);

    expect(body.innerHTML).toContain(CARD_HTML);
    expect(fixture.componentInstance.control.value).toBe(CARD_HTML);
    expect(fixture.componentInstance.control.pristine).toBeTrue();
  });

  it('stores bold text and text colour as inline HTML', async () => {
    const body = await editorBody(fixture);
    await edit(
      body,
      '<p><strong>Sold out</strong> and <span style="color: rgb(230, 0, 0);">red</span></p>',
    );

    expect(fixture.componentInstance.control.value).toBe(
      '<p><strong>Sold out</strong> and <span style="color: rgb(230, 0, 0);">red</span></p>',
    );
  });

  it('empties the control when all content is deleted, so required still fails', async () => {
    const body = await editorBody(fixture);
    await edit(body, '<p><br></p>');

    expect(fixture.componentInstance.control.value).toBe('');
  });

  it('applies a hex colour typed into the colour panel to the selected text', async () => {
    const body = await editorBody(fixture);
    await selectAll(body);
    await typeHex(await openColors(fixture, 'text'), 'ff8800');

    expect(fixture.componentInstance.control.value).toContain('color: rgb(255, 136, 0)');
  });

  it('never lets Enter in the hex field submit the surrounding form', async () => {
    const body = await editorBody(fixture);
    await selectAll(body);
    const key = await typeHex(await openColors(fixture, 'text'), 'ff8800');

    expect(key.defaultPrevented).toBeTrue();
    expect(fixture.componentInstance.submitted).toBeFalse();
  });

  it('closes the colour panel on Escape without letting it through', async () => {
    await editorBody(fixture);
    const panel = await openColors(fixture, 'text');
    const key = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    panel.dispatchEvent(key);
    await tick();

    expect(key.defaultPrevented).toBeTrue();
    expect(document.querySelector('.color-control__panel')).toBeNull();
  });

  it('accepts a three digit hex value and a value with its hash', async () => {
    const body = await editorBody(fixture);
    await selectAll(body);
    await typeHex(await openColors(fixture, 'text'), '0f0');

    expect(fixture.componentInstance.control.value).toContain('color: rgb(0, 255, 0)');

    await selectAll(body);
    await typeHex(await openColors(fixture, 'text'), '#3366cc');

    expect(fixture.componentInstance.control.value).toContain('color: rgb(51, 102, 204)');
  });

  it('keeps the last colour and flags the field when the typed value is not a colour', async () => {
    const body = await editorBody(fixture);
    await selectAll(body);
    await typeHex(await openColors(fixture, 'text'), 'ff8800');

    await selectAll(body);
    const panel = await openColors(fixture, 'text');
    await typeHex(panel, 'not a colour');

    expect(panel.querySelector('.color-control__hex--invalid')).toBeTruthy();
    expect(fixture.componentInstance.control.value).toContain('color: rgb(255, 136, 0)');
  });

  it('applies a preset swatch and then removes the colour again', async () => {
    const body = await editorBody(fixture);
    await selectAll(body);
    const panel = await openColors(fixture, 'text');
    (panel.querySelector('.color-control__preset') as HTMLButtonElement).click();
    await tick();

    expect(fixture.componentInstance.control.value).toContain('color: rgb(18, 18, 23)');

    await selectAll(body);
    const reopened = await openColors(fixture, 'text');
    (reopened.querySelector('.color-control__remove') as HTMLButtonElement).click();
    await tick();

    expect(fixture.componentInstance.control.value).not.toContain('color: rgb');
  });

  it('highlights the selected text from its own panel', async () => {
    const body = await editorBody(fixture);
    await selectAll(body);
    await typeHex(await openColors(fixture, 'highlight'), 'ffe066');

    expect(fixture.componentInstance.control.value).toContain('background-color: rgb(255, 224, 102)');
  });

  it('applies a font size in pixels to the selected text', async () => {
    const body = await editorBody(fixture);
    await selectAll(body);
    await enter(control(fixture, '.rich-text-editor__size'), '28');

    expect(fixture.componentInstance.control.value).toContain('font-size: 28px');
  });

  it('clamps a font size beyond the supported range', async () => {
    const body = await editorBody(fixture);
    await selectAll(body);
    await enter(control(fixture, '.rich-text-editor__size'), '500');

    expect(fixture.componentInstance.control.value).toContain('font-size: 96px');
  });

  it('reads a saved font size back into the editor and the toolbar', async () => {
    fixture.componentInstance.control.setValue(
      '<p><span style="font-size: 20px;">Twenty</span></p>',
    );
    const body = await editorBody(fixture);
    await selectAll(body);

    expect(body.innerHTML).toContain('font-size: 20px');
    expect(control(fixture, '.rich-text-editor__size').value).toBe('20');
  });

  it('offers bold, colour and size controls in its toolbar', async () => {
    await editorBody(fixture);

    expect(fixture.nativeElement.querySelector('button.ql-bold')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.color-control__trigger').length).toBe(2);
    expect(control(fixture, '.rich-text-editor__size').type).toBe('number');
  });
});
