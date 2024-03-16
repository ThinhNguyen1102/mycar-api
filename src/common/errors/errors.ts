import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
  ValidationError,
} from '@nestjs/common'
import {catchError, Observable, tap, throwError} from 'rxjs'
import {InternalServerErrorException, ValidationException} from './exceptions'

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start_request = Date.now()
    const method = context.getArgs()[0].method
    const url = context.getArgs()[0].url

    return next.handle().pipe(
      tap(() => {
        Logger.log(`${method} ${url} Execute time: ${Date.now() - start_request}ms`)
      }),
      catchError(err => {
        if (err instanceof HttpException) {
          return throwError(() => err)
        }

        Logger.error(err)
        Logger.log(`${method} ${url} Execute time: ${Date.now() - start_request}ms`)
        return throwError(() => new InternalServerErrorException())
      }),
    )
  }
}

export function exceptionFactory(errors: ValidationError[]): HttpException {
  return new ValidationException(transformValidationError(errors))
}

function transformValidationError(errors: ValidationError[], parent: string = null): any {
  let response: any = {}

  for (let i = 0; i < errors.length; ++i) {
    const error = errors[i]

    const currentPath = !parent ? error.property : [parent, error.property].join('.')

    if (!error.constraints) {
      const subErrors = transformValidationError(error.children, currentPath)
      response = {
        ...response,
        ...subErrors,
      }
      continue
    }

    response[currentPath] = Object.values(error.constraints).pop()
  }

  return response
}
