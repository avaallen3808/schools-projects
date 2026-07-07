import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SpmbService } from './spmb.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('spmb')
@UseGuards(JwtAuthGuard)
export class SpmbController {
  constructor(private spmbService: SpmbService) {}

  // ── Periods ─────────────────────────────────────────────

  @Get('periods')
  listPeriods(@Query('academicYearId') academicYearId?: string) {
    return this.spmbService.listPeriods(academicYearId);
  }

  @Post('periods')
  createPeriod(@Body() body: { academicYearId: string; name: string; startDate: string; endDate: string }) {
    return this.spmbService.createPeriod(body);
  }

  @Put('periods/:id')
  updatePeriod(@Param('id') id: string, @Body() body: { name?: string; startDate?: string; endDate?: string; isActive?: boolean }) {
    return this.spmbService.updatePeriod(id, body);
  }

  // ── Offerings ───────────────────────────────────────────

  @Get('offerings')
  listOfferings(@Query('periodId') periodId?: string) {
    return this.spmbService.listOfferings(periodId);
  }

  @Post('offerings')
  createOffering(@Body() body: { periodId: string; branchId: string; entryGradeId: string; trackId: string; quota: number; selectionConfig?: any }) {
    return this.spmbService.createOffering(body);
  }

  @Put('offerings/:id')
  updateOffering(@Param('id') id: string, @Body() body: { quota?: number; isActive?: boolean }) {
    return this.spmbService.updateOffering(id, body);
  }

  // ── Requirements ────────────────────────────────────────

  @Get('offerings/:offeringId/requirements')
  listRequirements(@Param('offeringId') offeringId: string) {
    return this.spmbService.listRequirements(offeringId);
  }

  @Post('requirements')
  createRequirement(@Body() body: { offeringId: string; name: string; isMandatory?: boolean; maxFileSize?: number; allowedTypes?: string }) {
    return this.spmbService.createRequirement(body);
  }

  @Delete('requirements/:id')
  deleteRequirement(@Param('id') id: string) {
    return this.spmbService.deleteRequirement(id);
  }

  // ── Registrations ───────────────────────────────────────

  @Get('registrations')
  listRegistrations(
    @Query('offeringId') offeringId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.spmbService.listRegistrations({ offeringId, status, page: page ? Number(page) : undefined, limit: limit ? Number(limit) : undefined });
  }

  @Get('registrations/:id')
  getRegistration(@Param('id') id: string) {
    return this.spmbService.getRegistration(id);
  }

  @Post('registrations')
  createRegistration(@Body() body: { userId: string; offeringId: string }) {
    return this.spmbService.createRegistration(body);
  }

  @Put('registrations/:id/status')
  updateRegistrationStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.spmbService.updateRegistrationStatus(id, body.status);
  }

  // ── Documents ───────────────────────────────────────────

  @Post('documents')
  uploadDocument(@Body() body: { registrationId: string; requirementId: string; fileUrl: string; fileName: string }) {
    return this.spmbService.uploadDocument(body);
  }

  @Put('documents/:id/verify')
  verifyDocument(@Param('id') id: string, @Body() body: { status: string }) {
    return this.spmbService.verifyDocument(id, body.status);
  }

  // ── Grades ──────────────────────────────────────────────

  @Post('grades/subject')
  addSubjectGrade(@Body() body: { registrationId: string; subject: string; semester: number; score: number }) {
    return this.spmbService.addSubjectGrade(body);
  }

  @Post('grades/exam')
  addExamScore(@Body() body: { registrationId: string; subject: string; score: number }) {
    return this.spmbService.addExamScore(body);
  }

  @Post('registrations/:id/calculate')
  calculateTotalScore(@Param('id') id: string) {
    return this.spmbService.calculateTotalScore(id);
  }

  @Post('selection/run')
  runSelection(@Body() body: { offeringId: string }) {
    return this.spmbService.runSelection(body.offeringId);
  }
}
