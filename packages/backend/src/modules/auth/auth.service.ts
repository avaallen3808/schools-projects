import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(data: { email: string; password: string; name: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email sudah terdaftar');

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.prisma.user.create({
      data: { email: data.email, password: hashedPassword, name: data.name },
    });

    const verificationToken = await this.createEmailVerification(user.id);

    return {
      ...this.generateTokens(user.id, user.email, user.role),
      verificationToken,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Email atau password salah');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Email atau password salah');

    return this.generateTokens(user.id, user.email, user.role);
  }

  async refreshToken(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await this.prisma.refreshToken.delete({ where: { id: stored.id } });
      throw new UnauthorizedException('Refresh token tidak valid atau kedaluwarsa');
    }

    // Rotate: delete old, issue new
    await this.prisma.refreshToken.delete({ where: { id: stored.id } });
    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) throw new UnauthorizedException('User tidak ditemukan');

    return this.generateTokens(user.id, user.email, user.role);
  }

  async verifyEmail(token: string) {
    const stored = await this.prisma.emailVerification.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await this.prisma.emailVerification.delete({ where: { id: stored.id } });
      throw new BadRequestException('Token verifikasi tidak valid atau kedaluwarsa');
    }

    await this.prisma.user.update({
      where: { id: stored.userId },
      data: { isVerified: true },
    });

    await this.prisma.emailVerification.delete({ where: { id: stored.id } });

    return { message: 'Email berhasil diverifikasi' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, isVerified: true, phone: true, avatar: true, createdAt: true },
    });
    if (!user) throw new UnauthorizedException('User tidak ditemukan');
    return user;
  }

  private generateTokens(userId: string, email: string, role: string) {
    const accessPayload = { sub: userId, email, role };
    const accessToken = this.jwtService.sign(accessPayload);

    const refreshToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(this.configService.get('JWT_REFRESH_EXPIRATION', '30').split('d')[0] || '30'));

    // Store refresh token in DB
    this.prisma.refreshToken.create({
      data: { userId, token: refreshToken, expiresAt },
    }).catch((err) => console.error('Failed to store refresh token:', err));

    return { accessToken, refreshToken, user: { id: userId, email, role } };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'Jika email terdaftar, link reset password akan dikirim' };

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.prisma.emailVerification.create({
      data: { userId: user.id, token, expiresAt },
    });

    // TODO: send email with reset link
    return { message: 'Link reset password telah dikirim', token };
  }

  async resetPassword(token: string, newPassword: string) {
    const stored = await this.prisma.emailVerification.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await this.prisma.emailVerification.delete({ where: { id: stored.id } });
      throw new BadRequestException('Token reset tidak valid atau kedaluwarsa');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id: stored.userId }, data: { password: hashedPassword } });
    await this.prisma.emailVerification.delete({ where: { id: stored.id } });

    return { message: 'Password berhasil direset' };
  }

  private async createEmailVerification(userId: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.prisma.emailVerification.create({
      data: { userId, token, expiresAt },
    });

    return token;
  }
}
