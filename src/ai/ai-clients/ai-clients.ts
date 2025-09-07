export interface AIClient {
  send(prompt: string): Promise<string>;
  pdfAnalysis(prompt: string, filePath: string): Promise<string>;
}
