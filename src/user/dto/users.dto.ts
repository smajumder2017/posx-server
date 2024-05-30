import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsUUID,
} from 'class-validator';

export class CreateUsersDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ required: true })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty({ required: true })
  @IsPhoneNumber()
  @IsNotEmpty()
  contactNo: string;

  @ApiProperty({ required: true })
  @IsUUID()
  @IsOptional()
  shopId: string;
}

export class UpdateUserDto extends CreateUsersDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  hashed_refresh_token?: string;
}

interface IUserRoleCreate {
  userId: string;
  roleId: number;
}

export class ChangeUserRolesDto {
  create: IUserRoleCreate[];
  delete: string[];
}
