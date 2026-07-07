import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('presence')
@UseGuards(JwtAuthGuard)
export class PresenceController {
  constructor(private presenceService: PresenceService) {}

  // ── Rombels ─────────────────────────────────────────────

  @Get('rombels')
  listRombels(@Query('branchId') branchId?: string, @Query('academicYearId') academicYearId?: string) {
    return this.presenceService.listRombels(branchId, academicYearId);
  }

  @Post('rombels')
  createRombel(@Body() body: { branchId: string; academicYearId: string; entryGradeId: string; name: string }) {
    return this.presenceService.createRombel(body);
  }

  @Delete('rombels/:id')
  deleteRombel(@Param('id') id: string) {
    return this.presenceService.deleteRombel(id);
  }

  // ── Records ─────────────────────────────────────────────

  @Get('records')
  listRecords(
    @Query('rombelId') rombelId?: string,
    @Query('date') date?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.presenceService.listRecords({ rombelId, date, page: page ? Number(page) : undefined, limit: limit ? Number(limit) : undefined });
  }

  @Post('records')
  createRecord(@Body() body: { rombelId: string; studentId: string; date: string; status: string; note?: string; createdBy: string }) {
    return this.presenceService.createOrUpdateRecord(body);
  }

  @Post('records/bulk')
  createBulkRecords(@Body() body: { rombelId: string; date: string; status: string; note?: string; createdBy: string; studentIds: string[] }) {
    return this.presenceService.createBulkRecords(body);
  }

  // ── Stats ───────────────────────────────────────────────

  @Get('stats/:rombelId')
  getStats(@Param('rombelId') rombelId: string, @Query('startDate') startDate: string, @Query('endDate') endDate: string, @Query('studentId') studentId?: string) {
    return this.presenceService.getStats(rombelId, startDate, endDate, studentId);
  }
}
