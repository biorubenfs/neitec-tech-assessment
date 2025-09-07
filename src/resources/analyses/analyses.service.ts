import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Analysis } from './analyses.entity';
import { MongoRepository } from 'typeorm';
import * as fsp from 'fs/promises';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { AVAILABLE_PROMPTS, buildFileName, loadPromptFromFile } from './utils';
import * as crypto from 'crypto';
import { AI_CLIENT } from './../../ai/ai-clients/ai-client.token';
import { AIClient } from './../../ai/ai-clients/ai-clients';

@Injectable()
export class AnalysesService {
  constructor(
    @InjectRepository(Analysis)
    private readonly analysisRepository: MongoRepository<Analysis>,
    @Inject(AI_CLIENT)
    private readonly aiClient: AIClient,
  ) {}

  async getAll(): Promise<Analysis[]> {
    const examples = await this.analysisRepository.find();
    return examples;
  }

  async create(
    file: Express.Multer.File,
    createData: CreateAnalysisDto,
  ): Promise<Analysis> {
    // save file to filesystem in _uploads folder
    const newFileName = buildFileName(file.originalname);

    await fsp.writeFile(`_uploads/${newFileName}`, file.buffer);

    const prompt = await loadPromptFromFile(AVAILABLE_PROMPTS.preliminary);
    const response = await this.aiClient.pdfAnalysis(
      prompt,
      `_uploads/${newFileName}`,
    );

    /* clean response from markdown and parse to JSON */
    const cleaned = response
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsedResponse: unknown = JSON.parse(cleaned);

    const data = {
      ...createData,
      fileData: {
        hash: crypto.createHash('sha256').update(file.buffer).digest('hex'),
        filename: newFileName,
        size: file.size,
      },
      rawResponse: parsedResponse,
    };

    const analysis = this.analysisRepository.create(data);
    return await this.analysisRepository.save(analysis);
  }
}
