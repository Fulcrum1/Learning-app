import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@prisma/prisma.service';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const {password, ...user} = createUserDto;
    const hashedPassword = await hash(password);
    const userCreated = await this.prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });

    const cardParam = await this.prisma.cardParam.create({
      data: {
        userId: userCreated.id,
        random: false,
        translationOnVerso: true,
      },
    });

    return userCreated;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
