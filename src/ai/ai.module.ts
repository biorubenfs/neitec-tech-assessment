import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MockAiClient } from './ai-clients/mock-client';
import { OpenAIClient } from './ai-clients/openai-client';
import { GeminiClient } from './ai-clients/gemini-client';
import { AI_CLIENT } from './ai-clients/ai-client.token';
import { AIClient } from './ai-clients/ai-clients';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: AI_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService): AIClient => {
        const provider = config.get<string>('AI_PROVIDER');

        switch (provider) {
          case 'openai':
            return new OpenAIClient(config);
          case 'gemini':
            return new GeminiClient(config);
          case 'mock':
            return new MockAiClient();
          default:
            throw new Error(`Unknown AI_PROVIDER: ${provider}`);
        }
      },
    },
  ],
  exports: [AI_CLIENT],
})
export class AiModule {}
