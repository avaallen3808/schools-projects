import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  listUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.usersService.listUsers({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      role,
      branchId,
    });
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Post()
  createUser(@Body() body: { email: string; password: string; name: string; role?: string; branchId?: string; phone?: string }) {
    return this.usersService.createUser(body);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: { email?: string; name?: string; role?: string; branchId?: string; phone?: string; isVerified?: boolean }) {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
