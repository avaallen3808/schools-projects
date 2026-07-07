# API Reference — CMS Sekolah v2.1.0

Base URL: `/api`

## Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new account |
| POST | `/auth/login` | Login → JWT tokens |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/verify-email` | Verify email with token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Set new password |
| GET | `/auth/profile` | Get current user profile |

## CMS

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cms/posts` | List posts (paginated) |
| GET | `/cms/posts/:slug` | Get post by slug |
| POST | `/cms/posts` | Create post (admin) |
| PUT | `/cms/posts/:id` | Update post |
| DELETE | `/cms/posts/:id` | Delete post (admin) |
| GET | `/cms/pages` | List static pages |
| GET | `/cms/pages/:slug` | Get page by slug |
| POST | `/cms/pages` | Create page (admin) |
| GET | `/cms/sliders` | List homepage sliders |
| POST | `/cms/sliders` | Create slider (admin) |
| GET | `/cms/menus` | List navigation menus |
| GET | `/cms/comments?postId=` | List comments |
| POST | `/cms/comments` | Submit comment |
| POST | `/media/upload` | Upload file (image/document) |

## Master Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/master/branches` | List branches |
| POST | `/master/branches` | Create branch (superadmin) |
| GET | `/master/academic-years` | List academic years |
| POST | `/master/academic-years` | Create academic year |
| GET | `/master/entry-grades` | List entry grades (SD, SMP, SMA) |
| GET | `/master/tracks` | List tracks (IPA, IPS, etc.) |
| GET | `/master/references` | List reference data |

## Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/students` | List students (filtered by branch) |
| GET | `/users/students/:id` | Get student detail |
| POST | `/users/students` | Create student |
| PUT | `/users/students/:id` | Update student |
| DELETE | `/users/students/:id` | Delete student |
| POST | `/users/students/import` | Import students via Excel |
| GET | `/users/teachers` | List teachers |
| POST | `/users/teachers` | Create teacher |
| POST | `/users/teachers/import` | Import teachers via Excel |
| GET | `/users/alumni` | List alumni |
| POST | `/users/alumni` | Register alumni |
| GET | `/users/rombel` | List rombel (class groups) |
| POST | `/users/rombel` | Create rombel |

## SPMB

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/spmb/periods` | List admission periods |
| POST | `/spmb/periods` | Create period |
| GET | `/spmb/offerings` | List offerings (filtered) |
| POST | `/spmb/offerings` | Create offering |
| GET | `/spmb/requirements` | List requirements |
| POST | `/spmb/requirements` | Create requirement |
| POST | `/spmb/register` | Register as candidate (calon siswa) |
| GET | `/spmb/my-registration` | Get own registration |
| PUT | `/spmb/my-registration` | Update own registration |
| GET | `/spmb/registrations` | List all registrations (operator) |
| GET | `/spmb/registrations/:id` | Get registration detail |
| POST | `/spmb/documents/upload` | Upload document |
| GET | `/spmb/documents/:id/status` | Check document status |
| PUT | `/spmb/documents/:id/verify` | Verify/reject document (operator) |
| POST | `/spmb/grades` | Input grades |
| POST | `/spmb/selection/run` | Run auto-selection |
| GET | `/spmb/selection/results` | View selection results |
| GET | `/spmb/registration/:id/certificate` | Download PDF certificate |

## Presence

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/presence/daily` | List daily attendance |
| POST | `/presence/daily` | Submit daily attendance |
| GET | `/presence/subject` | List subject attendance |
| POST | `/presence/subject` | Submit subject attendance |
| GET | `/presence/report` | Attendance report |
| GET | `/presence/schedule` | View schedules |

## ACL

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/acl/roles` | List roles |
| POST | `/acl/roles` | Create role |
| PUT | `/acl/roles/:id` | Update role |
| GET | `/acl/permissions` | List permissions |
| PUT | `/acl/abilities/:userId` | Set user abilities |

## Pagination

All list endpoints accept query params:

```
?page=1&limit=20&search=keyword&sort=createdAt&order=desc
```

Response meta:

```json
{
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

## Errors

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Email already exists" }
  ]
}
```
