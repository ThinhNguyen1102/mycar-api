import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common'
import {Response} from 'express'
import {VALIDATION_STATUS_CODE} from '../constants/common.const'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response: Response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const message = exception.message

    let data = {}

    if (exception instanceof ValidationException) {
      data['errors'] = exception.getResponse()
    } else if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse()
      data =
        typeof exceptionResponse === 'string' ? {message: exceptionResponse} : exceptionResponse
    } else {
      data['message'] = message
    }

    response.status(status).json({
      ...data,
    })
  }
}

export class NotFoundException extends HttpException {
  constructor(message: any = null) {
    super(message ?? 'Data not found!', HttpStatus.NOT_FOUND)
  }
}

export class BadRequestException extends HttpException {
  constructor(message: any = null) {
    super(message ?? 'Bad request!', HttpStatus.BAD_REQUEST)
  }
}

export class ValidationException extends HttpException {
  constructor(message: any = null) {
    super(message ?? 'Validation error!', VALIDATION_STATUS_CODE)
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: any = null) {
    super(message ?? 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: any = null) {
    super(message ?? 'Unauthorized', HttpStatus.UNAUTHORIZED)
  }
}
