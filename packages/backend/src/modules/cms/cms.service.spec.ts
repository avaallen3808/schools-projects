import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CmsService } from './cms.service';
import { PrismaService } from '../../common/prisma.service';

const mockPrisma = {
  post: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn() },
  category: { findMany: jest.fn(), create: jest.fn(), delete: jest.fn(), count: jest.fn() },
  page: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  slider: { findMany: jest.fn(), create: jest.fn(), delete: jest.fn() },
  comment: { findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
  contactMessage: { findMany: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn() },
};

describe('CmsService', () => {
  let service: CmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CmsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<CmsService>(CmsService);
    jest.clearAllMocks();
  });

  describe('posts', () => {
    it('should list published posts', async () => {
      mockPrisma.post.findMany.mockResolvedValue([{ id: 'p1', title: 'Test' }]);
      mockPrisma.post.count.mockResolvedValue(1);

      const result = await service.listPosts({ published: true });
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should get single post by slug', async () => {
      mockPrisma.post.findUnique.mockResolvedValue({ id: 'p1', title: 'Test', slug: 'test' });

      const post = await service.getPost('test');
      expect(post.title).toBe('Test');
    });

    it('should throw if post not found', async () => {
      mockPrisma.post.findUnique.mockResolvedValue(null);
      await expect(service.getPost('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('categories', () => {
    it('should list categories with count', async () => {
      mockPrisma.category.findMany.mockResolvedValue([{ id: 'c1', name: 'Berita', _count: { posts: 5 } }]);
      const cats = await service.listCategories();
      expect(cats).toHaveLength(1);
    });
  });

  describe('sliders', () => {
    it('should list active sliders ordered by sortOrder', async () => {
      mockPrisma.slider.findMany.mockResolvedValue([{ id: 's1', title: 'Hero' }]);
      const sliders = await service.listSliders();
      expect(sliders).toHaveLength(1);
    });
  });

  describe('contact messages', () => {
    it('should create contact message', async () => {
      mockPrisma.contactMessage.create.mockResolvedValue({ id: 'cm1', name: 'User', email: 'user@test.com', subject: 'Hello', message: 'Test' });

      const msg = await service.createContactMessage({ name: 'User', email: 'user@test.com', subject: 'Hello', message: 'Test' });
      expect(msg.id).toBe('cm1');
    });
  });
});
