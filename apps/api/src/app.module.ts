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

@Module({
  imports: [AuthModule, UsersModule, VocabularyModule, ExpressionModule, ListModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
