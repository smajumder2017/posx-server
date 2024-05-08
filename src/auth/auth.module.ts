import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [PassportModule.register({}), JwtModule.register({}), UserModule],
  providers: [JwtStrategy, JwtRefreshStrategy, AuthService],
  controllers: [AuthController],
  exports: [JwtStrategy, JwtRefreshStrategy, AuthService],
})
export class AuthModule {}
