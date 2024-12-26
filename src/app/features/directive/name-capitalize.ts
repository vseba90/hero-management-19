import {
  Directive,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appNameCapitalize]',
  standalone: true
})
export class NameCapitalizeDirective {
  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = this.capitalize(input.value);
  }

  private capitalize(input: string): string {
    return input.replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
