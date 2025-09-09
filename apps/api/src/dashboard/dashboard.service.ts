import { Injectable } from '@nestjs/common';
import { MockChainAdapter } from '@neocrypt/chain-adapter';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  private chainAdapter: MockChainAdapter;

  constructor(private prisma: PrismaService) {
    this.chainAdapter = new MockChainAdapter();
  }

  async getDashboardData(params: {
    species?: string;
    region?: string;
    from?: string;
    to?: string;
    orgId?: string;
  }) {
    return this.chainAdapter.getDashboards(params);
  }

  async getCollectionEvents(orgId?: string) {
    return this.prisma.collectionEvent.findMany({
      where: orgId ? { orgId } : undefined,
      include: {
        organization: true,
        collector: true,
      },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
  }

  async getProcessingSteps(orgId?: string) {
    return this.prisma.processingStep.findMany({
      where: orgId ? { facilityId: orgId } : undefined,
      include: {
        facility: true,
        operator: true,
      },
      orderBy: { timestampStart: 'desc' },
      take: 50,
    });
  }

  async getQualityTests(orgId?: string) {
    return this.prisma.qualityTest.findMany({
      where: orgId ? { labOrgId: orgId } : undefined,
      include: {
        labOrganization: true,
      },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
  }
}