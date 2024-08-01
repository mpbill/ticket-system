import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NylasModule } from './nylas/nylas.module';
import { ConfigModule } from '@nestjs/config'
import { OAuthToken } from './entity/oauth_token.entity';
import { AuthController } from './auth/auth.controller';
import { OauthTokensService } from './oauth-tokens/oauth-tokens.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { OrganizationModule } from './organization/organization.module';
import { User } from './entity/user.entity';
import { Entity } from 'typeorm';
import { Organization } from './entity/organization.entity';
import { Email } from './entity/email.entity';
import { Ticket } from './entity/ticket.entity';
console.log(process.env.DB_HOST)
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    JwtModule.register({
      secretOrPrivateKey: 'secret',
      signOptions: { expiresIn: '60m' },
      global: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      host: process.env.DB_HOST || 'localhost',
      password: 'password',
      username: 'postgres',
      database: 'platform',
      synchronize: true,
      dropSchema: false,
      autoLoadEntities: true,
      entities: [User, OAuthToken, Organization, Email, Ticket],
    }),
    NylasModule,
    AuthModule,
    OrganizationModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

