import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CmsService } from './cms.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('cms')
export class CmsController {
  constructor(private cmsService: CmsService) {}

  // ── Public ─────────────────────────────────────────────

  @Get('posts')
  listPosts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.cmsService.listPosts({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      published: true,
      categoryId,
    });
  }

  @Get('posts/:slug')
  getPost(@Param('slug') slug: string) {
    return this.cmsService.getPost(slug);
  }

  @Get('categories')
  listCategories() {
    return this.cmsService.listCategories();
  }

  @Get('pages/:slug')
  getPage(@Param('slug') slug: string) {
    return this.cmsService.getPage(slug);
  }

  @Get('sliders')
  listSliders() {
    return this.cmsService.listSliders();
  }

  @Post('comments')
  createComment(@Body() body: { postId: string; name: string; email: string; content: string }) {
    return this.cmsService.createComment(body);
  }

  @Get('comments/:postId')
  listComments(@Param('postId') postId: string) {
    return this.cmsService.listComments(postId, true);
  }

  @Post('contact')
  createContactMessage(@Body() body: { name: string; email: string; phone?: string; subject: string; message: string }) {
    return this.cmsService.createContactMessage(body);
  }

  // ── Admin (JWT) ────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('posts')
  createPost(@Body() body: { title: string; content: string; slug: string; excerpt?: string; imageUrl?: string; published?: boolean }) {
    return this.cmsService.createPost(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('posts/:id')
  updatePost(@Param('id') id: string, @Body() body: { title?: string; content?: string; slug?: string; excerpt?: string; imageUrl?: string; published?: boolean }) {
    return this.cmsService.updatePost(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('posts/:id')
  deletePost(@Param('id') id: string) {
    return this.cmsService.deletePost(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('categories')
  createCategory(@Body() body: { name: string; slug: string }) {
    return this.cmsService.createCategory(body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.cmsService.deleteCategory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('pages')
  createPage(@Body() body: { title: string; slug: string; content: string }) {
    return this.cmsService.createPage(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('pages/:id')
  updatePage(@Param('id') id: string, @Body() body: { title?: string; content?: string; published?: boolean }) {
    return this.cmsService.updatePage(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sliders')
  createSlider(@Body() body: { title: string; imageUrl: string; subtitle?: string; link?: string; sortOrder?: number }) {
    return this.cmsService.createSlider(body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('sliders/:id')
  deleteSlider(@Param('id') id: string) {
    return this.cmsService.deleteSlider(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('comments/:id/approve')
  approveComment(@Param('id') id: string) {
    return this.cmsService.approveComment(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/contact-messages')
  listContactMessages(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.cmsService.listContactMessages({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      unreadOnly: unreadOnly === 'true',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/contact-messages/:id/read')
  markContactAsRead(@Param('id') id: string) {
    return this.cmsService.markContactAsRead(id);
  }

  // ── Admin: all posts (including drafts) ────────────────

  @UseGuards(JwtAuthGuard)
  @Get('admin/posts')
  listAllPosts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.cmsService.listPosts({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }
}
