import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AnalysesService } from './analyses.service';
import { AnalysisResponseDto } from './dto/analysis-response.dto';
import { CreateAnalysisDto } from './dto/create-analysis.dto';

@Controller('analyses')
export class AnalysesController {
  constructor(private analysesService: AnalysesService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createAnalysisData: CreateAnalysisDto,
  ): Promise<AnalysisResponseDto> {
    if (file == null) {
      throw new HttpException('FileMissing', HttpStatus.BAD_REQUEST);
    }

    const response = await this.analysesService.create(
      file,
      createAnalysisData,
    );
    return new AnalysisResponseDto(response);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getAll(): Promise<ReadonlyArray<AnalysisResponseDto>> {
    const analyses = await this.analysesService.getAll();
    return analyses.map((entity) => new AnalysisResponseDto(entity));
  }
}
