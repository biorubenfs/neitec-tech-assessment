import { Exclude, Transform } from 'class-transformer';
import { Analysis } from '../analyses.entity';

export class AnalysisResponseDto {
  @Transform(({ obj }: { obj: Analysis }) => obj._id.toString())
  id: string;

  @Exclude()
  _id: any;

  fileData: object;
  rawResponse: string;

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Analysis>) {
    Object.assign(this, partial);
  }
}
