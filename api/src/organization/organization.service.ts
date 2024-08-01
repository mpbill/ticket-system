import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/entity/organization.entity';
import { User } from 'src/entity/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrganizationService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>, @InjectRepository(Organization) private readonly orgRepo: Repository<Organization>) { }

    async create(name: string, userId: number): Promise<Organization> {
        const org = this.orgRepo.create({ name });
        const user = await this.userRepo.findOneBy({ id: userId });
        const updatedOrg = await this.orgRepo.save(org);
        user!.organization = updatedOrg;
        await this.userRepo.save(user!);
        return updatedOrg;

    }

    async getOrg(userId: number): Promise<Organization> {
        const user = await this.userRepo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.organization', 'organization')
            .leftJoinAndSelect('organization.oauthToken', 'oauth_token')
            .where('user.id = :id', { id: userId })
            .getOne();
        return user!.organization;
    }
    async getOrgByOrgId(orgId: number): Promise<Organization> {
        const org = await this.orgRepo.findOneBy({ id: orgId });
        return org!;
    }
}
