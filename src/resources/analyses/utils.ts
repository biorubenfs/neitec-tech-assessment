import * as fsp from 'fs/promises';
import * as path from 'path';

export const AVAILABLE_PROMPTS = {
  preliminary: 'preliminary.txt',
  test: 'test.txt',
};

export function loadPromptFromFile(filePath: string): Promise<string> {
  return fsp.readFile(path.join('prompts', filePath), 'utf-8');
}

export function buildFileName(originalName: string): string {
  const ext = path.extname(originalName);
  const fileName = path.basename(originalName, ext);
  const timestamp = Date.now();
  return `${fileName}-${timestamp}${ext}`;
}
