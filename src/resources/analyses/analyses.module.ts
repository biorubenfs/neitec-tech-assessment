import { Module } from '@nestjs/common';
import { AnalysesController } from './analyses.controller';
import { AnalysesService } from './analyses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analysis } from './analyses.entity';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Analysis]), AiModule],
  controllers: [AnalysesController],
  providers: [AnalysesService],
})
export class AnalysesModule {}
