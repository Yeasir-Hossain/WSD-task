import morgan from 'morgan';
import { Request, Response, Handler } from 'express';
import logger from './logger';

morgan.token('message', (_req: Request, res: Response) => res.locals.errorMessage ?? '');
morgan.token('timestamp', () => new Date().toISOString());

const format = () => (process.env.NODE_ENV === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${format()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${format()}:method :url :status - :response-time ms - message: :message - timestamp: :timestamp`;

/**
 * Handle success response
 */
export const successHandler: Handler = morgan(successResponseFormat, {
	skip: (req: Request, res: Response) => res.statusCode >= 400,
	stream: { write: (message) => logger.info(message.trim()) },
});

/**a
 * Handle Error response
 */
export const errorHandler: Handler = morgan(errorResponseFormat, {
	skip: (req: Request, res: Response) => res.statusCode < 400,
	stream: { write: (message) => logger.error(message.trim()) },
});
