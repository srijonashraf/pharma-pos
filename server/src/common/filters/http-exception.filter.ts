import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const isDev =
      this.configService.get<string>('app.nodeEnv') === 'development';

    const { status, message, errors } = this.resolve(exception, isDev);

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
      ...(isDev && exception instanceof Error && { stack: exception.stack }),
    });
  }

  private resolve(exception: unknown, isDev: boolean) {
    if (exception instanceof HttpException) {
      const res = exception.getResponse() as Record<string, unknown>;
      return {
        status: exception.getStatus(),
        message:
          (typeof res === 'string' ? res : (res.message as string)) ??
          'Internal server error',
        errors: Array.isArray(res.message) ? (res.message as string[]) : null,
      };
    }

    if (exception instanceof Error) {
      this.logger.error(exception.message, isDev ? exception.stack : undefined);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: isDev ? exception.message : 'Internal server error',
        errors: null,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      errors: null,
    };
  }
}
