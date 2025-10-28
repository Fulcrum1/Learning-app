import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) { }
    
    async register(createUserDto: CreateUserDto) {
        const user = await this.usersService.findByEmail(createUserDto.email);

        if (user) throw new Error('User already exists');
        
        return this.usersService.create(createUserDto);
    }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user) throw new Error('User not found');

        const isPasswordMatch = await verify(user.password, password);

        if (!isPasswordMatch) throw new Error('Invalid password');

        return {id: user.id, name: user.name, email: user.email};
    }

    // async login(createUserDto: CreateUserDto) {
    //     const user = await this.usersService.findByEmail(createUserDto.email);

    //     if (!user) throw new Error('User not found');

    //     if (user.password !== createUserDto.password) throw new Error('Invalid password');

    //     return user;
    // }
}
