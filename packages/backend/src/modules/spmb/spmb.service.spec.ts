import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { SpmbService } from './spmb.service';
import { PrismaService } from '../../common/prisma.service';

const mockPrisma = {
  admissionPeriod: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  admissionOffering: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  admissionRequirement: { findMany: jest.fn(), create: jest.fn(), delete: jest.fn() },
  registration: { findMany: jest.fn(), findUnique: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn() },
  registrationDocument: { create: jest.fn(), update: jest.fn() },
  subjectGrade: { upsert: jest.fn() },
  examScore: { upsert: jest.fn() },
};

describe('SpmbService', () => {
  let service: SpmbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpmbService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<SpmbService>(SpmbService);
    jest.clearAllMocks();
  });

  it('should list periods', async () => {
    mockPrisma.admissionPeriod.findMany.mockResolvedValue([{ id: 'p1', name: 'Gelombang 1' }]);
    const result = await service.listPeriods();
    expect(result).toHaveLength(1);
  });

  it('should create registration with auto-generated number', async () => {
    mockPrisma.registration.findFirst.mockResolvedValue(null);
    mockPrisma.registration.count.mockResolvedValue(2);
    mockPrisma.registration.create.mockResolvedValue({ id: 'r1', number: 'REG-2026-00003' });
    const result = await service.createRegistration({ userId: 'u1', offeringId: 'o1' });
    expect(result.number).toBe('REG-2026-00003');
  });

  it('should throw ConflictException on duplicate registration', async () => {
    mockPrisma.registration.findFirst.mockResolvedValue({ id: 'existing' });
    await expect(service.createRegistration({ userId: 'u1', offeringId: 'o1' })).rejects.toThrow(ConflictException);
  });

  it('should calculate total score with weights', async () => {
    mockPrisma.registration.findUnique.mockResolvedValue({
      id: 'r1',
      subjectGrades: [{ score: 90 }, { score: 80 }],
      examScores: [{ score: 70 }],
      offering: { selectionConfig: { raporWeight: 0.6, ujianWeight: 0.4 } },
    });
    mockPrisma.registration.update.mockResolvedValue({ id: 'r1', totalScore: 82 });

    await service.calculateTotalScore('r1');
    expect(mockPrisma.registration.update).toHaveBeenCalled();
  });

  it('should throw NotFoundException on missing registration', async () => {
    mockPrisma.registration.findUnique.mockResolvedValue(null);
    await expect(service.getRegistration('nope')).rejects.toThrow(NotFoundException);
  });
});
