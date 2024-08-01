import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuthToken } from 'src/entity/oauth_token.entity';
import { Organization } from 'src/entity/organization.entity';
import { User } from 'src/entity/user.entity';
import { InsertResult, Repository } from 'typeorm';

@Injectable()
export class OauthTokensService {
    constructor(@InjectRepository(OAuthToken) private oauthTokenRepository: Repository<OAuthToken>, @InjectRepository(User) private userRepo: Repository<User>) { }

    findAll(): Promise<OAuthToken[]> {
        return this.oauthTokenRepository.find();
    }

    findOne(id: number): Promise<OAuthToken | null> {
        return this.oauthTokenRepository.findOneBy({ id });
    }
    findOneByEmail(email: string): Promise<OAuthToken | null> {
        return this.oauthTokenRepository.findOneBy({ email });
    }
    async findOneByUser(userId: number): Promise<OAuthToken | null> {
        const user = await this.userRepo.findOneBy({ id: userId });
        return this.oauthTokenRepository.findOneBy({ organization: user!.organization });
    }
    public async addToken(token: OAuthToken): Promise<OAuthToken> {
        const existingToken = await this.findOneByEmail(token.email);
        if (existingToken) {
            token.id = existingToken.id;
        }
        return await this.oauthTokenRepository.save(token);
    }
}
