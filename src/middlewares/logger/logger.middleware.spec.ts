import { Request, Response } from 'express';
import { LoggerMiddleware } from './logger.middleware';

describe('LoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new LoggerMiddleware()).toBeDefined();
  });

  it('should log requests', () => {
    const middleware = new LoggerMiddleware();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    const req = { method: 'GET', originalUrl: '/' } as Request;
    const res = {} as Response;
    const next = jest.fn();

    middleware.use(req, res, next);
    expect(logSpy).toHaveBeenCalled();
    const logArgs = logSpy.mock.calls[0][0];
    expect(logArgs).toContain(`${req.method} - ${req.originalUrl}`);
    expect(next).toHaveBeenCalled();

    logSpy.mockRestore();
  });
});
