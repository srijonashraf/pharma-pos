import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  ValidateNested,
  IsArray,
  IsUUID,
  IsEnum,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsUUID()
  medicineId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  unit?: string = 'Pcs';

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPct?: number = 0;
}

export class PaymentDto {
  @IsEnum(['cash', 'bank_card', 'mfs'])
  method: 'cash' | 'bank_card' | 'mfs';

  @IsNumber()
  @Min(0)
  amountTaken: number;
}

export class CreateOrderDto {
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  adjustment?: number = 0;

  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @IsOptional()
  @IsString()
  note?: string;
}
