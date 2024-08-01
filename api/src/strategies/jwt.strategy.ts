// jwt.strategy.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/auth/user.service';
import { Request } from 'express';
import { UserModel } from 'src/models/user.model';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    private readonly logger = new Logger(JwtStrategy.name);
    constructor(private readonly userService: UserService, private configService: ConfigService) {
        super({

            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                this.logger.log(`Extracting token from request`);
                let token = null;
                this.logger.log(`Request: ${JSON.stringify(request.cookies['jwt'])}`);
                if (request && request.cookies) {
                    this.logger.log(`Extracting token from request cookies`);
                    token = request.cookies['jwt'];
                }
                return token;
            }]),
            ignoreExpiration: false,

            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
        this.logger.log(`JWT_SECRET: ${configService.get<string>('JWT_SECRET')}`);
    }

    async validate(payload: any): Promise<UserModel> {
        return { userId: payload.sub, email: payload.email, name: payload.name };
    }
}