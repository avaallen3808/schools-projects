import { Controller, Post, Delete, Get, Param, UploadedFile, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
    return this.mediaService.upload(file, folder);
  }

  @Delete(':filename')
  delete(@Param('filename') filename: string, @Query('folder') folder?: string) {
    return this.mediaService.delete(`/uploads/${folder || 'general'}/${filename}`);
  }

  @Get('list')
  listFiles(@Query('folder') folder?: string) {
    return this.mediaService.listFiles(folder);
  }
}
