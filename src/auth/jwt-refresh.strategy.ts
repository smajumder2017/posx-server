import { BadRequestException, Injectable } from '@nestjs/common';
import { Request as RequestType } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/services/user.service';
import { JwtPayload } from './interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private userService: UserService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshStrategy.extractJWT,
        // ExtractJwt.fromBodyField('refreshToken'),
      ]),
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.id) {
      throw new BadRequestException();
    }
    const user = await this.userService.getUserById(payload.id);
    if (!user) {
      throw new BadRequestException();
    }
    return payload;
  }

  private static extractJWT(req: RequestType): string | null {
    if (!(req.cookies && 'refreshToken' in req.cookies)) {
      throw new BadRequestException();
    }
    if (req.cookies && 'refreshToken' in req.cookies) {
      return req.cookies.refreshToken;
    }
    return null;
  }
}
