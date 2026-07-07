import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CmsModule } from './modules/cms/cms.module';
import { MasterModule } from './modules/master/master.module';
import { UsersModule } from './modules/users/users.module';
import { SpmbModule } from './modules/spmb/spmb.module';
import { PresenceModule } from './modules/presence/presence.module';
import { AclModule } from './modules/acl/acl.module';
import { MediaModule } from './modules/media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        { ttl: 60000, limit: config.get('THROTTLE_LIMIT', 60) },
      ],
    }),
    PrismaModule,
    AuthModule,
    CmsModule,
    MasterModule,
    UsersModule,
    SpmbModule,
    PresenceModule,
    AclModule,
    MediaModule,
  ],
})
export class AppModule {}
