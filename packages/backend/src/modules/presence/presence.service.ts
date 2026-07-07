import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class PresenceService {
  constructor(private prisma: PrismaService) {}

  async listRombels(branchId?: string, academicYearId?: string) {
    const where = { branchId, academicYearId } as Record<string, unknown>;
    if (!branchId) delete where.branchId;
    if (!academicYearId) delete where.academicYearId;

    return this.prisma.rombel.findMany({
      where,
      include: { branch: { select: { name: true } }, academicYear: { select: { name: true } }, entryGrade: { select: { name: true } }, _count: { select: { presenceRecords: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async createRombel(data: { branchId: string; academicYearId: string; entryGradeId: string; name: string }) {
    return this.prisma.rombel.create({ data });
  }

  async deleteRombel(id: string) {
    const count = await this.prisma.presenceRecord.count({ where: { rombelId: id } });
    if (count > 0) throw new ConflictException('Rombel memiliki data presensi, hapus tidak diizinkan');
    return this.prisma.rombel.delete({ where: { id } });
  }

  async listRecords(params: { rombelId?: string; date?: string; page?: number; limit?: number }) {
    const { rombelId, date, page = 1, limit = 50 } = params;
    const where = {} as Record<string, unknown>;
    if (rombelId) where.rombelId = rombelId;
    if (date) where.date = new Date(date);

    const [records, total] = await Promise.all([
      this.prisma.presenceRecord.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { student: { select: { id: true, name: true } }, rombel: { select: { id: true, name: true } } },
      }),
      this.prisma.presenceRecord.count({ where }),
    ]);

    return { data: records, meta: { total, page, limit } };
  }

  async createOrUpdateRecord(data: { rombelId: string; studentId: string; date: string; status: string; note?: string; createdBy: string }) {
    const existing = await this.prisma.presenceRecord.findUnique({
      where: { rombelId_studentId_date: { rombelId: data.rombelId, studentId: data.studentId, date: new Date(data.date) } },
    });

    if (existing) {
      return this.prisma.presenceRecord.update({
        where: { id: existing.id },
        data: { status: data.status as any, note: data.note },
      });
    }

    return this.prisma.presenceRecord.create({
      data: { rombelId: data.rombelId, studentId: data.studentId, date: new Date(data.date), status: data.status as any, note: data.note, createdBy: data.createdBy },
    });
  }

  async createBulkRecords(data: { rombelId: string; date: string; status: string; note?: string; createdBy: string; studentIds: string[] }) {
    const records = data.studentIds.map((studentId) => ({
      rombelId: data.rombelId,
      studentId,
      date: new Date(data.date),
      status: data.status as any,
      note: data.note,
      createdBy: data.createdBy,
    }));

    // Upsert per record to avoid unique constraint violation
    const results = await Promise.all(
      records.map((r) =>
        this.prisma.presenceRecord.upsert({
          where: { rombelId_studentId_date: { rombelId: r.rombelId, studentId: r.studentId, date: r.date } },
          create: r,
          update: { status: r.status, note: r.note },
        }),
      ),
    );

    return { count: results.length };
  }

  async getStats(rombelId: string, startDate: string, endDate: string, studentId?: string) {
    const where: Record<string, unknown> = { rombelId, date: { gte: new Date(startDate), lte: new Date(endDate) } };
    if (studentId) where.studentId = studentId;

    const records = await this.prisma.presenceRecord.findMany({ where });

    const stats = {
      total: records.length,
      hadir: records.filter((r) => r.status === 'HADIR').length,
      izin: records.filter((r) => r.status === 'IZIN').length,
      sakit: records.filter((r) => r.status === 'SAKIT').length,
      alpa: records.filter((r) => r.status === 'ALPA').length,
    };

    return stats;
  }
}
