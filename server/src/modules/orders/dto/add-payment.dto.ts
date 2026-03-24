import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AddPaymentDto {
  @IsEnum(['cash', 'card', 'mfs'])
  method: 'cash' | 'card' | 'mfs';

  @IsNumber()
  @Min(0)
  amountTaken: number;

  @IsOptional()
  @IsString()
  reference?: string;
}
