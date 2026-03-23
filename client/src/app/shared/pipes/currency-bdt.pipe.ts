import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyBdt',
  standalone: true
})
export class CurrencyBdtPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value == null) return 'Tk. 0.00';
    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(parsed)) return 'Tk. 0.00';
    return `Tk. ${parsed.toFixed(2)}`;
  }
}
