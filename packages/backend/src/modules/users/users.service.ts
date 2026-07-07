import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async listUsers(params: { page?: number; limit?: number; role?: string; branchId?: string }) {
    const { page = 1, limit = 20, role, branchId } = params;
    const where = { role, branchId } as Record<string, unknown>;
    if (!role) delete where.role;
    if (!branchId) delete where.branchId;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: { id: true, email: true, name: true, role: true, isVerified: true, phone: true, branchId: true, createdAt: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data: users, meta: { total, page, limit } };
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, isVerified: true, phone: true, address: true, avatar: true, branchId: true, createdAt: true, updatedAt: true },
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  async createUser(data: { email: string; password: string; name: string; role?: string; branchId?: string; phone?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email sudah terdaftar');

    const hashedPassword = await bcrypt.hash(data.password, 12);
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role as any,
        branchId: data.branchId,
        phone: data.phone,
      },
      select: { id: true, email: true, name: true, role: true, phone: true, branchId: true, createdAt: true },
    });
  }

  async updateUser(id: string, data: Partial<{ email: string; name: string; role: string; branchId: string; phone: string; isVerified: boolean }>) {
    await this.getUser(id);
    return this.prisma.user.update({
      where: { id },
      data: data as any,
      select: { id: true, email: true, name: true, role: true, isVerified: true, phone: true, branchId: true },
    });
  }

  async deleteUser(id: string) {
    await this.getUser(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
