// user.controller.ts
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/models/user.model';

@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService) { }

    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        Logger.log(dto);
        return this.userService.create(dto.email, dto.password, dto.name);
    }
}