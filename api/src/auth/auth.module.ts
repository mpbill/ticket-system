// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import { OauthTokensService } from 'src/oauth-tokens/oauth-tokens.service';
import { OAuthToken } from 'src/entity/oauth_token.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        TypeOrmModule.forFeature([OAuthToken])
    ],
    providers: [AuthService, UserService, LocalStrategy, JwtStrategy, OauthTokensService, JwtService],
    controllers: [AuthController, UserController],
})
export class AuthModule { }