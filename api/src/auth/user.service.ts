// user.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(email: string, password: string, name: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ email, password: hashedPassword, name });
        this.logger.log(`Creating user ${email} with hashed pasword ${hashedPassword}`);
        return this.userRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneByOrFail({ email });
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        this.logger.log(`Validating user ${email} with password: ${password}`);
        const user = await this.findByEmail(email);
        if (!user) {
            Logger.log("User not found");
            return null;
        }
        this.logger.log(`User found: ${user.email} hash: ${user.password}`);
        if (await bcrypt.compare(password, user.password)) {
            Logger.log(`user ${email} validated`);
            return user;
        }
        Logger.log(`user ${email} not validated`);
        return null;
    }
}