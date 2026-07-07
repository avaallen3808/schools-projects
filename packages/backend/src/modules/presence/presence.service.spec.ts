import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { PrismaService } from '../../common/prisma.service';

const mockPrisma = {
  rombel: { findMany: jest.fn(), create: jest.fn(), delete: jest.fn() },
  presenceRecord: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), upsert: jest.fn(), count: jest.fn() },
};

describe('PresenceService', () => {
  let service: PresenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresenceService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<PresenceService>(PresenceService);
    jest.clearAllMocks();
  });

  it('should create rombel', async () => {
    mockPrisma.rombel.create.mockResolvedValue({ id: 'r1', name: '7A' });
    const result = await service.createRombel({ branchId: 'b1', academicYearId: 'ay1', entryGradeId: 'eg1', name: '7A' });
    expect(result.name).toBe('7A');
  });

  it('should throw ConflictException on delete rombel with records', async () => {
    mockPrisma.presenceRecord.count.mockResolvedValue(5);
    await expect(service.deleteRombel('r1')).rejects.toThrow(ConflictException);
  });

  it('should list records paginated', async () => {
    mockPrisma.presenceRecord.findMany.mockResolvedValue([{ id: 'pr1', status: 'HADIR' }]);
    mockPrisma.presenceRecord.count.mockResolvedValue(1);
    const result = await service.listRecords({ page: 1, limit: 50 });
    expect(result.data).toHaveLength(1);
  });

  it('should upsert record on createOrUpdate', async () => {
    mockPrisma.presenceRecord.findUnique.mockResolvedValue({ id: 'pr1', status: 'HADIR' });
    mockPrisma.presenceRecord.update.mockResolvedValue({ id: 'pr1', status: 'IZIN' });
    const result = await service.createOrUpdateRecord({ rombelId: 'r1', studentId: 's1', date: '2026-01-15', status: 'IZIN', createdBy: 'u1' });
    expect(result.status).toBe('IZIN');
  });

  it('should return stats', async () => {
    mockPrisma.presenceRecord.findMany.mockResolvedValue([
      { status: 'HADIR' }, { status: 'HADIR' }, { status: 'SAKIT' }, { status: 'IZIN' }, { status: 'ALPA' },
    ]);
    const stats = await service.getStats('r1', '2026-01-01', '2026-01-31');
    expect(stats.hadir).toBe(2);
    expect(stats.sakit).toBe(1);
    expect(stats.alpa).toBe(1);
  });
});
