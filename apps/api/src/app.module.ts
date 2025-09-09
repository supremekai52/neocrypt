import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { BatchesModule } from './batches/batches.module';
import { PublicModule } from './public/public.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RulesModule } from './rules/rules.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EventsModule,
    BatchesModule,
    PublicModule,
    DashboardModule,
    RulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}