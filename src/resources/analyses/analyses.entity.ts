import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

interface FileData {
  filename: string;
  size: number;
  hash: string;
}

export enum AnalysisType {
  Preliminary = 'preliminary',
}

@Entity()
export class Analysis {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  type: AnalysisType;

  @Column()
  fileData: FileData;

  @Column()
  rawResponse: unknown;

  // Timestamps fields that are automatically set by TypeORM
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(data: Partial<Analysis>) {
    Object.assign(this, data);
  }
}
