import { AIClient } from './ai-clients';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenAIClient implements AIClient {
  private client: OpenAI;

  constructor(private config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.get<string>('OPEN_AI_API_KEY'),
    });
  }

  async send(prompt: string): Promise<string> {
    const response = await this.client.responses.create({
      model: 'gpt-5',
      input: prompt,
    });
    return response.output_text;
  }

  async pdfAnalysis(prompt: string, pdfText: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Eres un asistente que responde preguntas sobre un documento PDF.',
        },
        { role: 'user', content: `Este es el contenido del PDF:\n${pdfText}` },
        { role: 'user', content: 'Resúmelo en un párrafo.' },
      ],
    });

    return response.choices[0].message?.content || '';
  }
}
