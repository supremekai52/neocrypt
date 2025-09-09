import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RulesService } from './rules.service';

@ApiTags('Rules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rules')
export class RulesController {
  constructor(private rulesService: RulesService) {}

  @Get('species/:code')
  @ApiOperation({ summary: 'Get rules for species' })
  async getRules(@Param('code') speciesCode: string) {
    return this.rulesService.getRules(speciesCode);
  }

  @Put('species/:code')
  @ApiOperation({ summary: 'Update rules for species' })
  async updateRules(
    @Param('code') speciesCode: string,
    @Body() data: {
      regionId: string;
      geohashPrefixes: string[];
      seasons: Array<{start: string, end: string}>;
      quotaPerSeason: number;
    },
  ) {
    return this.rulesService.updateRules(speciesCode, data);
  }
}