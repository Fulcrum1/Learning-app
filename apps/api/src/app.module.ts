import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { ExpressionModule } from './expression/expression.module';
import { ListModule } from './list/list.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, UsersModule, VocabularyModule, ExpressionModule, ListModule, CategoryModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  })],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
