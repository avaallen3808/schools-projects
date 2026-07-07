import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const firstError = result.error.errors[0];
      throw new BadRequestException(firstError?.message || 'Validasi gagal');
    }
    return result.data;
  }
}
