import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Superadmin
  const superadminPassword = await bcrypt.hash('admin123', 12);
  const superadmin = await prisma.user.upsert({
    where: { email: 'admin@sekolah.com' },
    update: {},
    create: {
      email: 'admin@sekolah.com',
      password: superadminPassword,
      name: 'Super Admin',
      role: 'SUPERADMIN',
      isVerified: true,
    },
  });

  // Branch
  const branch = await prisma.branch.upsert({
    where: { id: 'branch-1' },
    update: {},
    create: {
      id: 'branch-1',
      name: 'Sekolah Nusantara',
      address: 'Jl. Pendidikan No. 1, Jakarta',
      email: 'info@nusantara.sch.id',
    },
  });

  // Academic Year
  const academicYear = await prisma.academicYear.upsert({
    where: { id: 'ay-2025-2026' },
    update: {},
    create: {
      id: 'ay-2025-2026',
      name: '2025/2026',
      isActive: true,
    },
  });

  // Entry Grades
  const grades = ['SD', 'SMP', 'SMA'];
  for (const name of grades) {
    await prisma.entryGrade.upsert({
      where: { id: `grade-${name.toLowerCase()}` },
      update: {},
      create: { id: `grade-${name.toLowerCase()}`, name },
    });
  }

  // Tracks
  const tracks = ['IPA', 'IPS', 'Bahasa'];
  for (const name of tracks) {
    await prisma.track.upsert({
      where: { id: `track-${name.toLowerCase()}` },
      update: {},
      create: { id: `track-${name.toLowerCase()}`, name },
    });
  }

  console.log('✅ Seed completed');
  console.log('   Superadmin: admin@sekolah.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
