import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { MasterService } from './master.service';
import { PrismaService } from '../../common/prisma.service';

const mockPrisma = {
  branch: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn() },
  academicYear: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
  academicYearBranch: { upsert: jest.fn(), deleteMany: jest.fn() },
  entryGrade: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
  track: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
  rombel: { count: jest.fn() },
  admissionOffering: { count: jest.fn() },
};

describe('MasterService', () => {
  let service: MasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<MasterService>(MasterService);
    jest.clearAllMocks();
  });

  describe('branches', () => {
    it('should list branches with counts', async () => {
      mockPrisma.branch.findMany.mockResolvedValue([{ id: 'b1', name: 'SD', _count: { users: 10, rombels: 3 } }]);
      const result = await service.listBranches();
      expect(result).toHaveLength(1);
    });

    it('should throw NotFoundException for missing branch', async () => {
      mockPrisma.branch.findUnique.mockResolvedValue(null);
      await expect(service.getBranch('nope')).rejects.toThrow(NotFoundException);
    });

    it('should create branch', async () => {
      mockPrisma.branch.create.mockResolvedValue({ id: 'b1', name: 'SDIT' });
      const result = await service.createBranch({ name: 'SDIT' });
      expect(result.name).toBe('SDIT');
    });
  });

  describe('entry grades', () => {
    it('should create entry grade', async () => {
      mockPrisma.entryGrade.findUnique.mockResolvedValue(null);
      mockPrisma.entryGrade.create.mockResolvedValue({ id: 'eg1', name: 'SD' });
      const result = await service.createEntryGrade({ name: 'SD' });
      expect(result.name).toBe('SD');
    });

    it('should throw ConflictException for duplicate', async () => {
      mockPrisma.entryGrade.findUnique.mockResolvedValue({ id: 'eg1', name: 'SD' });
      await expect(service.createEntryGrade({ name: 'SD' })).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if entry grade used by rombel', async () => {
      mockPrisma.rombel.count.mockResolvedValue(1);
      await expect(service.deleteEntryGrade('eg1')).rejects.toThrow(ConflictException);
    });
  });

  describe('tracks', () => {
    it('should create track', async () => {
      mockPrisma.track.findUnique.mockResolvedValue(null);
      mockPrisma.track.create.mockResolvedValue({ id: 't1', name: 'IPA' });
      const result = await service.createTrack({ name: 'IPA' });
      expect(result.name).toBe('IPA');
    });

    it('should throw ConflictException for duplicate', async () => {
      mockPrisma.track.findUnique.mockResolvedValue({ id: 't1', name: 'IPA' });
      await expect(service.createTrack({ name: 'IPA' })).rejects.toThrow(ConflictException);
    });
  });
});
