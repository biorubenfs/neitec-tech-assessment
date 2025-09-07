import { Test, TestingModule } from '@nestjs/testing';
import { AnalysesService } from './analyses.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { Analysis, AnalysisType } from './analyses.entity';
import { ObjectId } from 'mongodb';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AI_CLIENT } from './../../ai/ai-clients/ai-client.token';
import { Readable } from 'stream';
import * as fsp from 'fs/promises';

jest.mock('fs/promises');

describe('AnalysesService', () => {
  let service: AnalysesService;

  const mockAnalysis = new Analysis({
    _id: new ObjectId('68bca7bff95bd3277f710d21'),
    type: AnalysisType.Preliminary,
    fileData: {
      hash: 'b4b8ceb666b37d49d6c83a33d316d53401d33222f3bf97663254958f4ead93d6',
      filename: 'Balance de situacion 31-12-2023-1757194160728.Pdf',
      size: 17214,
    },
    rawResponse: {
      company: 'LA BARRICA DE SIEMPRE S.L.',
      currentRatio: 3.3648,
      debtRatio: 0.2899,
      netProfitMargin: null,
      notes: 'notes',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const mockAnalysisRepository = {
    create: jest.fn(
      (dto: CreateAnalysisDto) =>
        new Analysis({
          _id: new ObjectId(),
          ...dto,
        }),
    ),
    save: jest.fn((analysis: Analysis) => Promise.resolve(analysis)),
    // find: jest.fn(), // This will be mocked in each test
    find: jest.fn(() => Promise.resolve([mockAnalysis])),
  };

  const sampleAIResponse = {
    company: 'LA BARRICA DE SIEMPRE S.L.',
    currentRatio: 3.3649,
    debtRatio: 0.2899,
    netProfitMargin: null,
    notes: 'notes',
  };

  const mockAiClient = {
    send: jest.fn(() => 'sample response'),
    pdfAnalysis: jest.fn(() => JSON.stringify(sampleAIResponse, null, 2)),
  };

  (fsp.writeFile as jest.Mock).mockResolvedValue(undefined);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysesService,
        {
          provide: getRepositoryToken(Analysis),
          useValue: mockAnalysisRepository,
        },
        {
          provide: AI_CLIENT,
          useValue: mockAiClient,
        },
      ],
    }).compile();

    service = module.get<AnalysesService>(AnalysesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list all analysis', async () => {
    const response = await service.getAll();
    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBeGreaterThanOrEqual(1);
  });

  it('should create an analysis', async () => {
    const fakeFile: Express.Multer.File = {
      originalname: 'test.pdf',
      buffer: Buffer.from('fake pdf'),
      size: 123,
      fieldname: 'file',
      encoding: '7bit',
      mimetype: 'application/pdf',
      destination: '',
      filename: '',
      path: '',
      stream: Readable.from(''),
    };

    const response = await service.create(fakeFile, {
      type: AnalysisType.Preliminary,
    });

    expect(mockAnalysisRepository.save).toHaveBeenCalled();
    expect(response).toHaveProperty('_id');
    expect(response.type).toStrictEqual('preliminary');
    expect(response.fileData.filename).toContain('test');
  });
});
