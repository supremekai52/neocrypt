import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PublicService } from './public.service';

@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Get('provenance/:slug')
  @ApiOperation({ summary: 'Get provenance bundle by slug' })
  async getProvenanceBundle(@Param('slug') slug: string) {
    return this.publicService.getProvenanceBundle(slug);
  }
}