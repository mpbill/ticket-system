// auth.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, UserModel } from 'src/models/user.model';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        return this.userService.validateUser(email, password);
    }

    async login(dto: LoginDto): Promise<{ access_token: string, user: UserModel }> {
        const user = await this.userService.findByEmail(dto.email);
        const payload = { email: dto.email, name: user!.name, sub: user!.id };
        return {
            access_token: this.jwtService.sign(payload, { secret: 'secret' }),
            user: { email: user!.email, name: user!.name, userId: user!.id }
        };
    }
}