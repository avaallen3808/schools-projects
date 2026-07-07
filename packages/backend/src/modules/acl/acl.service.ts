import { Injectable } from '@nestjs/common';
import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';

export type AppAbility = Ability<[string, string]>;

@Injectable()
export class AclService {
  forUser(user: { id: string; role: string; branchId?: string | null }): AppAbility {
    const { can, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>);

    switch (user.role) {
      case 'SUPERADMIN':
        can('manage', 'all');
        break;

      case 'ADMIN':
        can('manage', 'Post');
        can('manage', 'Category');
        can('manage', 'Page');
        can('manage', 'Slider');
        can('manage', 'Media');
        can('read', 'User');
        can('read', 'Branch');
        can('manage', 'AdmissionPeriod');
        can('manage', 'AdmissionOffering');
        can('manage', 'Registration');
        can('manage', 'PresenceRecord');
        can('manage', 'Rombel');
        break;

      case 'OPERATOR':
        can('read', 'Post');
        can('read', 'Category');
        can('read', 'Page');
        can('read', 'Slider');
        can('create', 'Registration');
        can('read', 'Registration');
        can('read', 'Branch');
        can('read', 'AdmissionPeriod');
        can('read', 'AdmissionOffering');
        can('create', 'PresenceRecord');
        can('read', 'PresenceRecord');
        break;

      case 'TEACHER':
        can('read', 'Post');
        can('read', 'Page');
        can('read', 'Rombel');
        can('create', 'PresenceRecord');
        can('read', 'PresenceRecord');
        break;

      case 'STUDENT':
        can('read', 'Post');
        can('read', 'Page');
        can('read', 'Slider');
        can('read', 'AdmissionOffering');
        can('create', 'Registration');
        can('read', 'Registration', { userId: user.id as any });
        break;

      case 'ALUMNI':
        can('read', 'Post');
        can('read', 'Page');
        break;
    }

    return build();
  }
}
