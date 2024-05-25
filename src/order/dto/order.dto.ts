import { ApiProperty } from '@nestjs/swagger';
import { Billing, OrderItem } from '@prisma/client';

import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  orderNumber: string;

  @ApiProperty()
  @IsUUID()
  shopId: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  employeeId?: string;

  @ApiProperty()
  @IsNumber()
  orderStatusId: number;

  @ApiProperty()
  @IsBoolean()
  isClosed: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cancellationReason?: string;

  items: OrderItem[];

  bills: Billing[];
}
