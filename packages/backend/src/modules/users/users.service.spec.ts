import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../../common/prisma.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('hashed') }));

const mockPrisma = {
  user: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn() },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should list users paginated', async () => {
    mockPrisma.user.findMany.mockResolvedValue([{ id: 'u1', name: 'User', email: 'u@t.com' }]);
    mockPrisma.user.count.mockResolvedValue(1);
    const result = await service.listUsers({ page: 1, limit: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });

  it('should get user by id', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', name: 'Test' });
    const user = await service.getUser('u1');
    expect(user.name).toBe('Test');
  });

  it('should throw on missing user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(service.getUser('nope')).rejects.toThrow(NotFoundException);
  });

  it('should create user with hashed password', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({ id: 'u1', email: 'new@t.com', name: 'New', role: 'STUDENT' });
    const user = await service.createUser({ email: 'new@t.com', password: '123456', name: 'New' });
    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 12);
    expect(user.email).toBe('new@t.com');
  });

  it('should throw on duplicate email', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1' });
    await expect(service.createUser({ email: 'dup@t.com', password: '123456', name: 'Dup' })).rejects.toThrow(ConflictException);
  });
});
