import { IsEnum, IsNumber, Min } from 'class-validator';

export class AddPaymentDto {
  @IsEnum(['cash', 'bank_card', 'mfs'])
  method: 'cash' | 'bank_card' | 'mfs';

  @IsNumber()
  @Min(0)
  amountTaken: number;
}
