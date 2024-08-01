import { Controller, Get, Session, Req, Logger, Res, Post, UseGuards, Body } from '@nestjs/common';
import { OauthTokensService } from 'src/oauth-tokens/oauth-tokens.service';
import { Request, Response } from 'express';
import { LoginDto, UserModel } from 'src/models/user.model';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard, LocalAuthGuard } from 'src/strategies/guards';
import { User } from 'src/decorators/user.decorator';
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name)
    constructor(private readonly oauthService: OauthTokensService, private readonly authService: AuthService) { }

    @Get('logout')
    async logout(@Req() request: Request, @Res() res: Response, @Session() session: Record<string, any>): Promise<void> {
        this.logger.log("Logout")
        res.clearCookie('jwt')
        res.send();
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response, @User() user: UserModel): Promise<any> {
        const token = await this.authService.login(dto);
        res.cookie('jwt', token.access_token, { httpOnly: true })
        res.send(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@User() user: UserModel): UserModel {
        return user;
    }
}
