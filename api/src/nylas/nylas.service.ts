import { Injectable, Logger, Req, Session } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Nylas, { URLForAuthenticationConfig, CodeExchangeRequest } from 'nylas'
import { OAuthToken } from 'src/entity/oauth_token.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { Organization } from 'src/entity/organization.entity';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/auth/user.service';
import { OrganizationService } from 'src/organization/organization.service';

@Injectable()
export class NylasService {
    private nylas: Nylas;
    private readonly logger = new Logger(NylasService.name)
    private readonly config;
    constructor(private configService: ConfigService, private readonly orgService: OrganizationService) {
        this.config = {
            clientId: this.configService.getOrThrow<string>('NYLAS_CLIENT_ID'),
            callbackUri: "http://localhost:3000/nylas/oauth",
            apiKey: this.configService.getOrThrow<string>('NYLAS_API_KEY'),
            apiUri: this.configService.get<string>('NYLAS_API_URI'),

        }
        this.nylas = new Nylas({
            apiKey: this.config.apiKey,
            apiUri: this.config.apiUri,
        });
    }

    public getAuthUrl(orgId: number): string {
        const configForAuth: URLForAuthenticationConfig = {
            clientId: this.config.clientId,
            redirectUri: this.config.callbackUri,
            state: orgId.toString(),
        }
        this.logger.log(configForAuth)
        const url = this.nylas.auth.urlForOAuth2(configForAuth)
        return url;
    }
    async exchangeCodeForToken(code: string, orgId: number): Promise<OAuthToken> {
        const request: CodeExchangeRequest = { code: code, redirectUri: this.config.callbackUri, clientId: this.config.clientId }
        this.logger.log(request)
        const token = await this.nylas.auth.exchangeCodeForToken(request)
        this.logger.log(token)
        const org = await this.orgService.getOrgByOrgId(orgId)
        console.log(org)
        const oauthToken: OAuthToken = {
            email: token.email,
            accessToken: token.accessToken,
            expiresIn: token.expiresIn,
            tokenType: token.tokenType,
            grantId: token.grantId,
            idToken: token.idToken,
            provider: token.provider,
            id: 0,
            organization: org
        }
        return oauthToken
    }
    async getEmails() {
        const emails = await this.nylas.messages.list({ identifier: '62ad3b8f-20d0-46f9-b741-e66723306dcf', queryParams: { limit: 5 } });
        return emails;
    }
}
