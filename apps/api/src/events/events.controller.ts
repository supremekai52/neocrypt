import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';

@ApiTags('Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post('collection')
  @ApiOperation({ summary: 'Create collection event' })
  async createCollectionEvent(@Body() data: any) {
    return this.eventsService.createCollectionEvent(data);
  }

  @Post('processing')
  @ApiOperation({ summary: 'Create processing step' })
  async createProcessingStep(@Body() data: any) {
    return this.eventsService.createProcessingStep(data);
  }

  @Post('quality')
  @ApiOperation({ summary: 'Create quality test' })
  async createQualityTest(@Body() data: any) {
    return this.eventsService.createQualityTest(data);
  }

  @Post('custody')
  @ApiOperation({ summary: 'Create custody event' })
  async createCustodyEvent(@Body() data: any) {
    return this.eventsService.createCustodyEvent(data);
  }
}