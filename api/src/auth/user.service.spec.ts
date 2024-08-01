import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UserModel } from 'src/models/user.model';
import { User } from 'src/entity/user.entity';

describe('UserService', () => {
    let service: UserService;
    let userRepository: Repository<User>;



    test('bcrypt', async () => {
        const hash = await bcrypt.hashSync('password', 10);
        const result = await bcrypt.compare('password', hash);
        expect(result).toBe(true);
    });


});