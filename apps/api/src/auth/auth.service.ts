import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { verify } from 'argon2';
import { AuthJwtPayload } from './types/auth-jwtPayload.d';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.findByEmail(createUserDto.email);

    if (user) throw new Error('User already exists');

    return this.usersService.create(createUserDto);
  }

  // async login(email: string, password: string) {
  //     const user = await this.usersService.findByEmail(email);

  //     if (!user) throw new Error('User not found');

  //     const isPasswordMatch = await verify(user.password, password);

  //     if (!isPasswordMatch) throw new Error('Invalid password');

  //     return {id: user.id, name: user.name, email: user.email};
  // }

  async login(userId: string, name: string) {
    const { accessToken } = await this.generateToken(userId);
    return { id: userId, name: name, accessToken };
  }

  async generateToken(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken] = await Promise.all([this.jwtService.signAsync(payload)]);

    return { accessToken };
  }
}
