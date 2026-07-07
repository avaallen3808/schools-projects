import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal server error';

    if (exception.code === 'P2002') {
      status = HttpStatus.CONFLICT;
      error = 'Data sudah ada';
    } else if (exception.code === 'P2025') {
      status = HttpStatus.NOT_FOUND;
      error = 'Data tidak ditemukan';
    } else if (exception.code === 'P2003') {
      status = HttpStatus.BAD_REQUEST;
      error = 'Referensi data tidak valid';
    }

    response.status(status).json({ success: false, error, statusCode: status });
  }
}
