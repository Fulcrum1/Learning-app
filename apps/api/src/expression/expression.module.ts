import { Module } from '@nestjs/common';
import { ExpressionService } from './expression.service';
import { ExpressionController } from './expression.controller';

@Module({
  controllers: [ExpressionController],
  providers: [ExpressionService],
})
export class ExpressionModule {}
