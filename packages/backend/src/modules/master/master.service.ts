import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class MasterService {
  constructor(private prisma: PrismaService) {}

  // ── Branches ────────────────────────────────────────────

  async listBranches() {
    return this.prisma.branch.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { users: true, rombels: true } } } });
  }

  async getBranch(id: string) {
    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) throw new NotFoundException('Branch tidak ditemukan');
    return branch;
  }

  async createBranch(data: { name: string; address?: string; phone?: string; email?: string }) {
    return this.prisma.branch.create({ data });
  }

  async updateBranch(id: string, data: Partial<{ name: string; address: string; phone: string; email: string; isActive: boolean }>) {
    await this.getBranch(id);
    return this.prisma.branch.update({ where: { id }, data });
  }

  async deleteBranch(id: string) {
    await this.getBranch(id);
    return this.prisma.branch.delete({ where: { id } });
  }

  // ── Academic Years ──────────────────────────────────────

  async listAcademicYears() {
    return this.prisma.academicYear.findMany({
      orderBy: { name: 'desc' },
      include: { branches: { include: { branch: { select: { id: true, name: true } } } } },
    });
  }

  async createAcademicYear(data: { name: string; isActive?: boolean }) {
    return this.prisma.academicYear.create({ data });
  }

  async updateAcademicYear(id: string, data: Partial<{ name: string; isActive: boolean }>) {
    const year = await this.prisma.academicYear.findUnique({ where: { id } });
    if (!year) throw new NotFoundException('Academic year tidak ditemukan');

    if (data.isActive === true) {
      await this.prisma.academicYear.updateMany({ where: { isActive: true }, data: { isActive: false } });
    }

    return this.prisma.academicYear.update({ where: { id }, data });
  }

  async assignBranch(yearId: string, branchId: string) {
    return this.prisma.academicYearBranch.upsert({
      where: { academicYearId_branchId: { academicYearId: yearId, branchId } },
      create: { academicYearId: yearId, branchId },
      update: {},
    });
  }

  async removeBranch(yearId: string, branchId: string) {
    return this.prisma.academicYearBranch.deleteMany({ where: { academicYearId: yearId, branchId } });
  }

  // ── Entry Grades ────────────────────────────────────────

  async listEntryGrades() {
    return this.prisma.entryGrade.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { offerings: true, rombels: true } } } });
  }

  async createEntryGrade(data: { name: string }) {
    const existing = await this.prisma.entryGrade.findUnique({ where: { name: data.name } });
    if (existing) throw new ConflictException('Entry grade sudah ada');
    return this.prisma.entryGrade.create({ data });
  }

  async deleteEntryGrade(id: string) {
    const count = await this.prisma.rombel.count({ where: { entryGradeId: id } });
    if (count > 0) throw new ConflictException('Entry grade masih digunakan oleh rombel');
    return this.prisma.entryGrade.delete({ where: { id } });
  }

  // ── Tracks ──────────────────────────────────────────────

  async listTracks() {
    return this.prisma.track.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { offerings: true } } } });
  }

  async createTrack(data: { name: string }) {
    const existing = await this.prisma.track.findUnique({ where: { name: data.name } });
    if (existing) throw new ConflictException('Track sudah ada');
    return this.prisma.track.create({ data });
  }

  async deleteTrack(id: string) {
    const count = await this.prisma.admissionOffering.count({ where: { trackId: id } });
    if (count > 0) throw new ConflictException('Track masih digunakan oleh offering');
    return this.prisma.track.delete({ where: { id } });
  }
}
