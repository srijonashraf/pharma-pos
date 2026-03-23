import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface PaginatedData {
  data: unknown[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        const d = data as PaginatedData | undefined;
        if (d?.meta && Array.isArray(d?.data)) {
          return { success: true, data: d.data, meta: d.meta };
        }
        return { success: true, data };
      }),
    );
  }
}
