import {
  BadRequestException,
  Body,
  Controller,
  // ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import { AuthService } from '../services/auth.service';
import {
  AccessTokenResponseDto,
  LoginDto,
  LoginResponseDto,
  UserInfoResponseDto,
} from '../dto/auth.dto';
import { UserService } from 'src/user/services/user.service';
import { CreateUsersDto } from 'src/user/dto/users.dto';
import { JwtRefreshTokenGuard } from '../guards/jwt-refresh-token.guard';
import { GetUser } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
// import { RolesGuard } from '../guards/roles.guard';
// import { Roles } from '../decorators/roles.decorator';
// import { Roles as Role } from 'src/enums';
import {
  ApiSecurity,
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtPayload } from '../interfaces';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  // for api documentation
  @ApiResponse({
    type: LoginResponseDto,
    status: 200,
    description: 'login with user_name and password',
  })
  //
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new BadRequestException('User doesnt exists');
    }
    const validPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!validPassword) {
      throw new BadRequestException('Password Mismached');
    }
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      userName: user.userName,
      isActive: user.isActive,
      userShops: user.userShops,
      userRoles: user.userRoles,
      contactNo: user.contactNo,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const accessToken = await this.authService.generateAccessToken(payload);
    const refreshToken = await this.authService.generateRefreshToken(payload);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    return {
      accessToken,
    };
  }

  // for api documentation
  @ApiResponse({
    status: 200,
    description: 'Logout the user',
  })
  @ApiSecurity('bearer')
  @ApiBearerAuth()
  // for api documentation
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken');
    return;
  }

  // for api documentation
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: UserInfoResponseDto,
  })
  @ApiSecurity('bearer')
  @ApiBearerAuth()
  // for api documentation
  @UseGuards(JwtAuthGuard)
  @Get('userInfo')
  async getSession(@GetUser() user: JwtPayload): Promise<UserInfoResponseDto> {
    const userInfo = this.userService.getUserById(user.id);
    return userInfo;
  }

  // for api documentation
  @ApiResponse({
    type: AccessTokenResponseDto,
    status: 200,
    description: 'get accessToken with valid refresh token',
  })
  //
  @UseGuards(JwtRefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refreshToken')
  async getAccessToken(
    @GetUser() user: JwtPayload,
  ): Promise<AccessTokenResponseDto> {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      userName: user.userName,
      isActive: user.isActive,
      userShops: user.userShops,
      userRoles: user.userRoles,
      contactNo: user.contactNo,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return {
      accessToken: await this.authService.generateAccessToken(payload),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/register')
  async create(@Body() createUserDto: CreateUsersDto) {
    await this.userService.createUser(createUserDto);
    return;
  }
}
