import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../../common/prisma.service';
import * as bcrypt from 'bcryptjs';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  refreshToken: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  emailVerification: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-access-token'),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('30d'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return tokens', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test',
        role: 'STUDENT',
      });
      mockPrisma.emailVerification.create.mockResolvedValue({
        id: 'ev-1',
        userId: 'user-1',
        token: 'verify-token',
      });
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.register({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test',
      });

      expect(result.accessToken).toBe('mock-access-token');
      expect(result.refreshToken).toBeDefined();
      expect(result.verificationToken).toBeDefined();
      expect(typeof result.verificationToken).toBe('string');
      expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException if email exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        service.register({ email: 'existing@test.com', password: 'password123', name: 'Test' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 12);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        password: hashedPassword,
        role: 'STUDENT',
      });
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.login('test@test.com', 'password123');
      expect(result.accessToken).toBe('mock-access-token');
      expect(result.user.email).toBe('test@test.com');
    });

    it('should throw UnauthorizedException if email not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login('notfound@test.com', 'password123')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if wrong password', async () => {
      const hashedPassword = await bcrypt.hash('correct-password', 12);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        password: hashedPassword,
        role: 'STUDENT',
      });

      await expect(service.login('test@test.com', 'wrong-password')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should rotate refresh token', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-1',
        userId: 'user-1',
        token: 'old-token',
        expiresAt: new Date(Date.now() + 86400000),
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        role: 'STUDENT',
      });
      mockPrisma.refreshToken.delete.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.refreshToken('old-token');
      expect(result.accessToken).toBe('mock-access-token');
      expect(mockPrisma.refreshToken.delete).toHaveBeenCalledWith({ where: { id: 'rt-1' } });
    });

    it('should throw UnauthorizedException if token expired', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-expired',
        userId: 'user-1',
        token: 'expired-token',
        expiresAt: new Date(Date.now() - 86400000),
      });
      mockPrisma.refreshToken.delete.mockResolvedValue({});

      await expect(service.refreshToken('expired-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with valid token', async () => {
      mockPrisma.emailVerification.findUnique.mockResolvedValue({
        id: 'ev-1',
        userId: 'user-1',
        token: 'valid-token',
        expiresAt: new Date(Date.now() + 86400000),
      });
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.emailVerification.delete.mockResolvedValue({});

      const result = await service.verifyEmail('valid-token');
      expect(result.message).toBe('Email berhasil diverifikasi');
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { isVerified: true } }),
      );
    });

    it('should throw BadRequestException if token expired', async () => {
      mockPrisma.emailVerification.findUnique.mockResolvedValue({
        id: 'ev-expired',
        userId: 'user-1',
        token: 'expired-token',
        expiresAt: new Date(Date.now() - 86400000),
      });
      mockPrisma.emailVerification.delete.mockResolvedValue({});

      await expect(service.verifyEmail('expired-token')).rejects.toThrow(BadRequestException);
    });
  });
});
