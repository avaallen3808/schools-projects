import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

@Injectable()
export class MediaService {
  private uploadDir: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get('UPLOAD_DIR', './uploads');
  }

  async upload(file: Express.Multer.File, folder = 'general') {
    if (!file) throw new BadRequestException('File tidak ditemukan');

    const destDir = path.join(this.uploadDir, folder);
    await fs.mkdir(destDir, { recursive: true });

    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const destPath = path.join(destDir, filename);

    await fs.writeFile(destPath, file.buffer);

    return {
      url: `/uploads/${folder}/${filename}`,
      filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async delete(fileUrl: string) {
    const filePath = path.join(process.cwd(), fileUrl);
    try {
      await fs.unlink(filePath);
    } catch {
      throw new NotFoundException('File tidak ditemukan');
    }
    return { message: 'File berhasil dihapus' };
  }

  async listFiles(folder = 'general') {
    const dir = path.join(this.uploadDir, folder);
    try {
      const files = await fs.readdir(dir);
      return files.map((f) => ({
        url: `/uploads/${folder}/${f}`,
        filename: f,
      }));
    } catch {
      return [];
    }
  }
}
