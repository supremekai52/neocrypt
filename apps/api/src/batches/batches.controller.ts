import { Controller, Post, Get, Param, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BatchesService } from './batches.service';

@ApiTags('Batches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('batches')
export class BatchesController {
  constructor(private batchesService: BatchesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new batch' })
  async createBatch(@Body() data: {
    inputs: Array<{refId: string, weightKg: number}>,
    bom: any,
    manufacturerOrgId: string,
  }) {
    return this.batchesService.createBatch(data);
  }

  @Post(':id/mint')
  @ApiOperation({ summary: 'Mint batch and generate QR' })
  async mintBatch(@Param('id') id: string) {
    return this.batchesService.mintBatch(id);
  }

  @Post(':id/recall')
  @ApiOperation({ summary: 'Recall batch' })
  async recallBatch(@Param('id') id: string, @Body() data: { reason: string }) {
    await this.batchesService.recallBatch(id, data.reason);
    return { message: 'Batch recalled successfully' };
  }

  @Get()
  @ApiOperation({ summary: 'Get all batches' })
  async getBatches(@Query('orgId') orgId?: string) {
    return this.batchesService.getBatches(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get batch by ID' })
  async getBatch(@Param('id') id: string) {
    return this.batchesService.getBatch(id);
  }
}