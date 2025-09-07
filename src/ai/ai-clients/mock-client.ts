import { AIClient } from './ai-clients';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MockAiClient implements AIClient {
  async send(prompt: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
    return `Mock response for prompt: ${prompt}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async pdfAnalysis(prompt: string, filepath: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
    return `Mock response for prompt with file: ${prompt}`;
  }
}
