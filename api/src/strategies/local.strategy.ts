// local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/auth/user.service';
import { LoginDto, UserModel } from 'src/models/user.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(LocalStrategy.name);
    constructor(private readonly userService: UserService) {
        super({ usernameField: 'email', });
    }

    async validate(email: string, password: string): Promise<UserModel> {
        Logger.log(`Local Strategy Validating user ${email}`);
        const user = await this.userService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return { email: user.email, name: user.name, userId: user.id };
    }
}