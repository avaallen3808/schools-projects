import { AclService } from './acl.service';

describe('AclService', () => {
  let service: AclService;

  beforeEach(() => {
    service = new AclService();
  });

  it('superadmin gets all permissions', () => {
    const ability = service.forUser({ id: 'u1', role: 'SUPERADMIN' });
    expect(ability.can('manage', 'all')).toBe(true);
  });

  it('teacher can create presence but not manage users', () => {
    const ability = service.forUser({ id: 'u1', role: 'TEACHER' });
    expect(ability.can('create', 'PresenceRecord')).toBe(true);
    expect(ability.cannot('manage', 'User')).toBe(true);
  });

  it('student gets read + registration', () => {
    const ability = service.forUser({ id: 'u1', role: 'STUDENT' });
    expect(ability.can('read', 'Post')).toBe(true);
    expect(ability.can('create', 'Registration')).toBe(true);
    expect(ability.cannot('delete', 'Post')).toBe(true);
  });

  it('alumni gets read-only', () => {
    const ability = service.forUser({ id: 'u1', role: 'ALUMNI' });
    expect(ability.can('read', 'Post')).toBe(true);
    expect(ability.cannot('create', 'Post')).toBe(true);
  });
});
