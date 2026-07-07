import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MasterService } from './master.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('master')
@UseGuards(JwtAuthGuard)
export class MasterController {
  constructor(private masterService: MasterService) {}

  // ── Branches ────────────────────────────────────────────

  @Get('branches')
  listBranches() {
    return this.masterService.listBranches();
  }

  @Get('branches/:id')
  getBranch(@Param('id') id: string) {
    return this.masterService.getBranch(id);
  }

  @Post('branches')
  createBranch(@Body() body: { name: string; address?: string; phone?: string; email?: string }) {
    return this.masterService.createBranch(body);
  }

  @Put('branches/:id')
  updateBranch(@Param('id') id: string, @Body() body: { name?: string; address?: string; phone?: string; email?: string; isActive?: boolean }) {
    return this.masterService.updateBranch(id, body);
  }

  @Delete('branches/:id')
  deleteBranch(@Param('id') id: string) {
    return this.masterService.deleteBranch(id);
  }

  // ── Academic Years ──────────────────────────────────────

  @Get('academic-years')
  listAcademicYears() {
    return this.masterService.listAcademicYears();
  }

  @Post('academic-years')
  createAcademicYear(@Body() body: { name: string; isActive?: boolean }) {
    return this.masterService.createAcademicYear(body);
  }

  @Put('academic-years/:id')
  updateAcademicYear(@Param('id') id: string, @Body() body: { name?: string; isActive?: boolean }) {
    return this.masterService.updateAcademicYear(id, body);
  }

  @Post('academic-years/:yearId/branches/:branchId')
  assignBranch(@Param('yearId') yearId: string, @Param('branchId') branchId: string) {
    return this.masterService.assignBranch(yearId, branchId);
  }

  @Delete('academic-years/:yearId/branches/:branchId')
  removeBranch(@Param('yearId') yearId: string, @Param('branchId') branchId: string) {
    return this.masterService.removeBranch(yearId, branchId);
  }

  // ── Entry Grades ────────────────────────────────────────

  @Get('entry-grades')
  listEntryGrades() {
    return this.masterService.listEntryGrades();
  }

  @Post('entry-grades')
  createEntryGrade(@Body() body: { name: string }) {
    return this.masterService.createEntryGrade(body);
  }

  @Delete('entry-grades/:id')
  deleteEntryGrade(@Param('id') id: string) {
    return this.masterService.deleteEntryGrade(id);
  }

  // ── Tracks ──────────────────────────────────────────────

  @Get('tracks')
  listTracks() {
    return this.masterService.listTracks();
  }

  @Post('tracks')
  createTrack(@Body() body: { name: string }) {
    return this.masterService.createTrack(body);
  }

  @Delete('tracks/:id')
  deleteTrack(@Param('id') id: string) {
    return this.masterService.deleteTrack(id);
  }
}
