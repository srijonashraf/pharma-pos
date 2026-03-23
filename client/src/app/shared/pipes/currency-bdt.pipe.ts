import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyBdt', standalone: true })
export class CurrencyBdtPipe implements PipeTransform {
  transform(value: number | null | undefined, prefix = 'Tk. '): string {
    if (value === null || value === undefined) return `${prefix}0.00`;
    return `${prefix}${Number(value).toFixed(2)}`;
  }
}
