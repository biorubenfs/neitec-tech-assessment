import { Test, TestingModule } from '@nestjs/testing';
import { AnalysesController } from './analyses.controller';
import { AnalysesService } from './analyses.service';
import { Analysis, AnalysisType } from './analyses.entity';
import { ObjectId } from 'mongodb';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { instanceToPlain } from 'class-transformer';
import { Readable } from 'stream';

describe('AnalysesController', () => {
  let controller: AnalysesController;
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

  beforeEach(async () => {
    const mockAnalysisService = {
      getAll: jest.fn().mockResolvedValue([mockAnalysis]),
      create: jest.fn(() => mockAnalysis),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalysesController],
      providers: [AnalysesService],
    })
      .overrideProvider(AnalysesService)
      .useValue(mockAnalysisService)
      .compile();

    controller = module.get<AnalysesController>(AnalysesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an analysis', async () => {
    const createAnalysisDto: CreateAnalysisDto = {
      type: AnalysisType.Preliminary,
    };

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

    const result = await controller.create(fakeFile, createAnalysisDto);
    const serializedResult = instanceToPlain(result);

    expect(serializedResult).toHaveProperty('id');
    expect(serializedResult.id).toStrictEqual('68bca7bff95bd3277f710d21');
  });

  it('should return all analyses', async () => {
    const results = await controller.getAll();
    const serializedResult = results.map((res) => instanceToPlain(res));

    expect(Array.isArray(serializedResult)).toBe(true);
    expect(
      serializedResult.map((res) => res.id as string).length,
    ).toBeGreaterThanOrEqual(1);
  });
});
