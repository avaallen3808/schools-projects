import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class SpmbService {
  constructor(private prisma: PrismaService) {}

  // ── Admission Periods ───────────────────────────────────

  async listPeriods(academicYearId?: string) {
    const where = academicYearId ? { academicYearId } : {};
    return this.prisma.admissionPeriod.findMany({ where, orderBy: { startDate: 'desc' }, include: { academicYear: { select: { id: true, name: true } }, _count: { select: { offerings: true } } } });
  }

  async createPeriod(data: { academicYearId: string; name: string; startDate: string; endDate: string }) {
    return this.prisma.admissionPeriod.create({ data: { ...data, startDate: new Date(data.startDate), endDate: new Date(data.endDate) } });
  }

  async updatePeriod(id: string, data: Partial<{ name: string; startDate: string; endDate: string; isActive: boolean }>) {
    const period = await this.prisma.admissionPeriod.findUnique({ where: { id } });
    if (!period) throw new NotFoundException('Periode pendaftaran tidak ditemukan');
    const updateData: Record<string, unknown> = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    return this.prisma.admissionPeriod.update({ where: { id }, data: updateData as any });
  }

  // ── Admission Offerings ─────────────────────────────────

  async listOfferings(periodId?: string) {
    const where = periodId ? { periodId } : {};
    return this.prisma.admissionOffering.findMany({
      where,
      include: {
        period: { select: { id: true, name: true } },
        branch: { select: { id: true, name: true } },
        entryGrade: { select: { id: true, name: true } },
        track: { select: { id: true, name: true } },
        _count: { select: { requirements: true, registrations: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createOffering(data: { periodId: string; branchId: string; entryGradeId: string; trackId: string; quota: number; selectionConfig?: Prisma.InputJsonValue }) {
    return this.prisma.admissionOffering.create({
      data: { ...data, selectionConfig: data.selectionConfig ?? undefined },
      include: { branch: { select: { name: true } }, entryGrade: { select: { name: true } }, track: { select: { name: true } } },
    });
  }

  async updateOffering(id: string, data: Partial<{ quota: number; isActive: boolean; selectionConfig: Prisma.InputJsonValue }>) {
    const offering = await this.prisma.admissionOffering.findUnique({ where: { id } });
    if (!offering) throw new NotFoundException('Offering tidak ditemukan');
    return this.prisma.admissionOffering.update({ where: { id }, data: data as any });
  }

  // ── Requirements ────────────────────────────────────────

  async listRequirements(offeringId: string) {
    return this.prisma.admissionRequirement.findMany({ where: { offeringId }, orderBy: { name: 'asc' } });
  }

  async createRequirement(data: { offeringId: string; name: string; isMandatory?: boolean; maxFileSize?: number; allowedTypes?: string }) {
    return this.prisma.admissionRequirement.create({ data });
  }

  async deleteRequirement(id: string) {
    return this.prisma.admissionRequirement.delete({ where: { id } });
  }

  // ── Registrations ───────────────────────────────────────

  async listRegistrations(params: { offeringId?: string; status?: string; page?: number; limit?: number }) {
    const { offeringId, status, page = 1, limit = 20 } = params;
    const where = { offeringId, status } as Record<string, unknown>;
    if (!offeringId) delete where.offeringId;
    if (!status) delete where.status;

    const [registrations, total] = await Promise.all([
      this.prisma.registration.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } }, offering: { include: { branch: { select: { name: true } }, entryGrade: { select: { name: true } }, track: { select: { name: true } } } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.registration.count({ where }),
    ]);

    return { data: registrations, meta: { total, page, limit } };
  }

  async getRegistration(id: string) {
    const reg = await this.prisma.registration.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } }, documents: true, subjectGrades: true, examScores: true, offering: true },
    });
    if (!reg) throw new NotFoundException('Registrasi tidak ditemukan');
    return reg;
  }

  async createRegistration(data: { userId: string; offeringId: string }) {
    const existing = await this.prisma.registration.findFirst({ where: { userId: data.userId, offeringId: data.offeringId } });
    if (existing) throw new ConflictException('User sudah terdaftar di offering ini');

    const count = await this.prisma.registration.count({ where: { offeringId: data.offeringId } });
    const number = `REG-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    return this.prisma.registration.create({ data: { ...data, number } });
  }

  async updateRegistrationStatus(id: string, status: string) {
    await this.getRegistration(id);
    return this.prisma.registration.update({ where: { id }, data: { status: status as any } });
  }

  // ── Documents ───────────────────────────────────────────

  async uploadDocument(data: { registrationId: string; requirementId: string; fileUrl: string; fileName: string }) {
    return this.prisma.registrationDocument.create({ data });
  }

  async verifyDocument(id: string, status: string) {
    return this.prisma.registrationDocument.update({ where: { id }, data: { status: status as any, verifiedAt: new Date() } });
  }

  // ── Subject Grades ──────────────────────────────────────

  async addSubjectGrade(data: { registrationId: string; subject: string; semester: number; score: number }) {
    return this.prisma.subjectGrade.upsert({
      where: { registrationId_subject_semester: { registrationId: data.registrationId, subject: data.subject, semester: data.semester } },
      create: data,
      update: { score: data.score },
    });
  }

  // ── Exam Scores ─────────────────────────────────────────

  async addExamScore(data: { registrationId: string; subject: string; score: number }) {
    return this.prisma.examScore.upsert({
      where: { registrationId_subject: { registrationId: data.registrationId, subject: data.subject } },
      create: data,
      update: { score: data.score },
    });
  }

  async calculateTotalScore(id: string) {
    const reg = await this.getRegistration(id);

    const offering = reg.offering;
    const config = offering.selectionConfig as Record<string, number> | null;

    const raporWeight = config?.raporWeight ?? 0.6;
    const ujianWeight = config?.ujianWeight ?? 0.4;

    const avgRapor = reg.subjectGrades.length > 0
      ? reg.subjectGrades.reduce((sum, g) => sum + g.score, 0) / reg.subjectGrades.length
      : 0;

    const avgUjian = reg.examScores.length > 0
      ? reg.examScores.reduce((sum, g) => sum + g.score, 0) / reg.examScores.length
      : 0;

    const totalScore = avgRapor * raporWeight + avgUjian * ujianWeight;

    return this.prisma.registration.update({ where: { id }, data: { totalScore } });
  }

  // ── Auto-Selection ──────────────────────────────────────

  async runSelection(offeringId: string) {
    const offering = await this.prisma.admissionOffering.findUnique({ where: { id: offeringId } });
    if (!offering) throw new NotFoundException('Offering tidak ditemukan');

    // Calculate scores for all pending registrations
    const registrations = await this.prisma.registration.findMany({
      where: { offeringId, status: 'SUBMITTED' },
      include: { subjectGrades: true, examScores: true },
    });

    if (registrations.length === 0) {
      throw new BadRequestException('Tidak ada pendaftar dengan status SUBMITTED');
    }

    const config = offering.selectionConfig as Record<string, number> | null;
    const raporWeight = config?.raporWeight ?? 0.6;
    const ujianWeight = config?.ujianWeight ?? 0.4;

    // Calculate and update total scores
    for (const reg of registrations) {
      const avgRapor = reg.subjectGrades.length > 0
        ? reg.subjectGrades.reduce((sum, g) => sum + g.score, 0) / reg.subjectGrades.length
        : 0;
      const avgUjian = reg.examScores.length > 0
        ? reg.examScores.reduce((sum, g) => sum + g.score, 0) / reg.examScores.length
        : 0;
      const totalScore = avgRapor * raporWeight + avgUjian * ujianWeight;

      await this.prisma.registration.update({ where: { id: reg.id }, data: { totalScore } });
    }

    // Re-fetch with updated scores, sort descending
    const ranked = await this.prisma.registration.findMany({
      where: { offeringId, status: 'SUBMITTED' },
      orderBy: { totalScore: 'desc' },
    });

    // Accept up to quota
    const accepted = ranked.slice(0, offering.quota);
    const rejected = ranked.slice(offering.quota);

    await Promise.all([
      ...accepted.map((r) => this.prisma.registration.update({ where: { id: r.id }, data: { status: 'ACCEPTED' } })),
      ...rejected.map((r) => this.prisma.registration.update({ where: { id: r.id }, data: { status: 'REJECTED' } })),
    ]);

    return { accepted: accepted.length, rejected: rejected.length, total: ranked.length };
  }
}
