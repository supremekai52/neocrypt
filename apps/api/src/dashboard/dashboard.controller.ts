import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get dashboard metrics' })
  async getDashboardData(
    @Query('species') species?: string,
    @Query('region') region?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('orgId') orgId?: string,
  ) {
    return this.dashboardService.getDashboardData({
      species,
      region,
      from,
      to,
      orgId,
    });
  }

  @Get('events/collection')
  @ApiOperation({ summary: 'Get collection events' })
  async getCollectionEvents(@Query('orgId') orgId?: string) {
    return this.dashboardService.getCollectionEvents(orgId);
  }

  @Get('events/processing')
  @ApiOperation({ summary: 'Get processing steps' })
  async getProcessingSteps(@Query('orgId') orgId?: string) {
    return this.dashboardService.getProcessingSteps(orgId);
  }

  @Get('events/quality')
  @ApiOperation({ summary: 'Get quality tests' })
  async getQualityTests(@Query('orgId') orgId?: string) {
    return this.dashboardService.getQualityTests(orgId);
  }
}