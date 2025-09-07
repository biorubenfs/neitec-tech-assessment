import { AnalysisType } from '../analyses.entity';
import { IsEnum } from 'class-validator';

export class CreateAnalysisDto {
  @IsEnum(AnalysisType)
  type: AnalysisType;
}
