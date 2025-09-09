import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RulesService {
  constructor(private prisma: PrismaService) {}

  async getRules(speciesCode: string) {
    const rules = await this.prisma.ruleSet.findMany({
      where: { speciesCode },
    });

    return rules;
  }

  async updateRules(speciesCode: string, data: {
    regionId: string;
    geohashPrefixes: string[];
    seasons: Array<{start: string, end: string}>;
    quotaPerSeason: number;
  }) {
    const version = `v${Date.now()}`;

    const ruleSet = await this.prisma.ruleSet.upsert({
      where: {
        speciesCode_regionId: {
          speciesCode,
          regionId: data.regionId,
        },
      },
      update: {
        geohashPrefixes: data.geohashPrefixes,
        seasons: data.seasons,
        quotaPerSeason: data.quotaPerSeason,
        version,
        updatedAt: new Date(),
      },
      create: {
        speciesCode,
        regionId: data.regionId,
        geohashPrefixes: data.geohashPrefixes,
        seasons: data.seasons,
        quotaPerSeason: data.quotaPerSeason,
        version,
      },
    });

    return ruleSet;
  }
}