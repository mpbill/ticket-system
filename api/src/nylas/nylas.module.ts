import { Module } from '@nestjs/common';
import { NylasService } from './nylas.service';
import { NylasController } from './nylas.controller';
import { OAuthToken } from 'src/entity/oauth_token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthTokensService } from 'src/oauth-tokens/oauth-tokens.service';
import { Organization } from 'src/entity/organization.entity';
import { OrganizationService } from 'src/organization/organization.service';
import { UserService } from 'src/auth/user.service';
import { User } from 'src/entity/user.entity';
import { TemporalService } from './temporal.service';

@Module({
    imports: [TypeOrmModule.forFeature([OAuthToken]), TypeOrmModule.forFeature([Organization]), TypeOrmModule.forFeature([User])],
    providers: [NylasService, OauthTokensService, OrganizationService, UserService, TemporalService],
    controllers: [NylasController],
})
export class NylasModule { }
