export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  meta?: { total: number; page: number; limit: number };
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};

export const USER_ROLES = ['SUPERADMIN', 'ADMIN', 'OPERATOR', 'TEACHER', 'STUDENT', 'ALUMNI'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const REGISTRATION_STATUSES = ['DRAFT', 'SUBMITTED', 'VERIFIED', 'ACCEPTED', 'REJECTED'] as const;

export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];
