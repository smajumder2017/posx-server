import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { JwtPayload } from '../interfaces';
// import { Roles } from 'src/enums';
// import { RestaurantResponseDto } from 'src/restaurants/dto/restaurants.dto';
// import { JwtPayload } from '../interfaces';

export class LoginDto {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;
}

export class AccessTokenResponseDto {
  @ApiProperty()
  accessToken: string;
}

export class AccessTokenDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class UserInfoResponseDto implements JwtPayload {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userName: string;

  email: string;

  contactNo: string;

  firstName: string;

  lastName: string;

  isActive: boolean;

  userRoles: {
    id: string;
    userId: string;
    roleId: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
  userShops: {
    id: string;
    userId: string;
    shopId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  // @ApiProperty()
  // role: Roles;
  // @ApiProperty()
  // is_active: boolean;
  // @ApiProperty()
  // restaurant_id: string;
  // @ApiProperty({ type: RestaurantResponseDto })
  // @Optional()
  // restaurant?: RestaurantResponseDto;
}
