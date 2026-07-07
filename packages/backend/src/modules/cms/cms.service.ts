import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  // ── Posts ──────────────────────────────────────────────

  async listPosts(params: { page?: number; limit?: number; published?: boolean; categoryId?: string }) {
    const { page = 1, limit = 20, published, categoryId } = params;
    const where = { published, categoryId } as Record<string, unknown>;
    if (published === undefined) delete where.published;
    if (!categoryId) delete where.categoryId;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: { author: { select: { id: true, name: true } }, category: { select: { id: true, name: true, slug: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where }),
    ]);

    return { data: posts, meta: { total, page, limit } };
  }

  async getPost(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: { author: { select: { id: true, name: true } }, category: { select: { id: true, name: true, slug: true } }, comments: { where: { approved: true }, orderBy: { createdAt: 'desc' } } },
    });
    if (!post) throw new NotFoundException('Post tidak ditemukan');
    return post;
  }

  async createPost(data: { title: string; content: string; slug: string; excerpt?: string; authorId?: string; categoryId?: string; imageUrl?: string; published?: boolean }) {
    return this.prisma.post.create({ data });
  }

  async updatePost(id: string, data: Partial<{ title: string; content: string; slug: string; excerpt: string; categoryId: string; imageUrl: string; published: boolean }>) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post tidak ditemukan');
    return this.prisma.post.update({ where: { id }, data });
  }

  async deletePost(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post tidak ditemukan');
    return this.prisma.post.delete({ where: { id } });
  }

  // ── Categories ─────────────────────────────────────────

  async listCategories() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { posts: true } } } });
  }

  async createCategory(data: { name: string; slug: string }) {
    return this.prisma.category.create({ data });
  }

  async deleteCategory(id: string) {
    const count = await this.prisma.post.count({ where: { categoryId: id } });
    if (count > 0) throw new ForbiddenException('Kategori masih digunakan oleh post');
    return this.prisma.category.delete({ where: { id } });
  }

  // ── Pages ──────────────────────────────────────────────

  async getPage(slug: string) {
    const page = await this.prisma.page.findUnique({ where: { slug } });
    if (!page) throw new NotFoundException('Halaman tidak ditemukan');
    return page;
  }

  async createPage(data: { title: string; slug: string; content: string; metaTitle?: string; metaDesc?: string; published?: boolean }) {
    return this.prisma.page.create({ data });
  }

  async updatePage(id: string, data: Partial<{ title: string; content: string; metaTitle: string; metaDesc: string; published: boolean }>) {
    const page = await this.prisma.page.findUnique({ where: { id } });
    if (!page) throw new NotFoundException('Halaman tidak ditemukan');
    return this.prisma.page.update({ where: { id }, data });
  }

  // ── Sliders ────────────────────────────────────────────

  async listSliders() {
    return this.prisma.slider.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
  }

  async createSlider(data: { title: string; subtitle?: string; imageUrl: string; link?: string; sortOrder?: number }) {
    return this.prisma.slider.create({ data });
  }

  async deleteSlider(id: string) {
    return this.prisma.slider.delete({ where: { id } });
  }

  // ── Comments ───────────────────────────────────────────

  async listComments(postId: string, approvedOnly = false) {
    const where = { postId, ...approvedOnly ? { approved: true } : {} } as Record<string, unknown>;
    if (!approvedOnly) delete where.approved;
    return this.prisma.comment.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async approveComment(id: string) {
    return this.prisma.comment.update({ where: { id }, data: { approved: true } });
  }

  async createComment(data: { postId: string; name: string; email: string; content: string }) {
    return this.prisma.comment.create({ data });
  }

  // ── Contact Messages ───────────────────────────────────

  async listContactMessages(params: { page?: number; limit?: number; unreadOnly?: boolean }) {
    const { page = 1, limit = 20, unreadOnly } = params;
    const where = unreadOnly ? { isRead: false } : {};

    const [messages, total] = await Promise.all([
      this.prisma.contactMessage.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.contactMessage.count({ where }),
    ]);

    return { data: messages, meta: { total, page, limit } };
  }

  async createContactMessage(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
    return this.prisma.contactMessage.create({ data });
  }

  async markContactAsRead(id: string) {
    return this.prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  }
}
