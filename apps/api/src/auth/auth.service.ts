import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) { }
    async register(createUserDto: CreateUserDto) {
        const user = await this.usersService.findByEmail(createUserDto.email);

        if (user) throw new Error('User already exists');
        
        return this.usersService.create(createUserDto);
    }
}
