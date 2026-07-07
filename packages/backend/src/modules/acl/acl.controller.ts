import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AclService } from './acl.service';

@Controller('acl')
@UseGuards(JwtAuthGuard)
export class AclController {
  constructor(private aclService: AclService) {}

  @Get('my-abilities')
  getMyAbilities(@Request() req: { user: { id: string; role: string; branchId?: string } }) {
    const ability = this.aclService.forUser(req.user);
    const rules = ability.rules.map((r: { action: string | string[]; subject: string | string[] }) => ({
      action: r.action,
      subject: r.subject,
    }));
    return { rules };
  }
}
