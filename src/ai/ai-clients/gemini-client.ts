import { Injectable } from '@nestjs/common';
import { AIClient } from './ai-clients';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class GeminiClient implements AIClient {
  private client: GoogleGenAI;

  constructor(private config: ConfigService) {
    this.client = new GoogleGenAI({
      apiKey: this.config.get<string>('GEMINI_API_KEY'),
    });
  }

  async send(prompt: string): Promise<string> {
    const response = await this.client.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    return response.text ?? 'foo';
  }

  async pdfAnalysis(prompt: string, filePath: string): Promise<string> {
    const file = fs.readFileSync(filePath);
    const fileBuffer = Buffer.from(file);

    if (fileBuffer == null) {
      throw new Error('file not found');
    }

    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: fileBuffer.toString('base64'),
        },
      },
    ];

    const response = await this.client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
    });

    return response.text ?? 'foo';
  }
}
