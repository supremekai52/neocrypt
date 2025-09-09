import { Injectable, NotFoundException } from '@nestjs/common';
import { MockChainAdapter } from '@neocrypt/chain-adapter';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicService {
  private chainAdapter: MockChainAdapter;

  constructor(private prisma: PrismaService) {
    this.chainAdapter = new MockChainAdapter();
  }

  async getProvenanceBundle(slug: string) {
    const batch = await this.chainAdapter.getBatchBySlug(slug);
    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const bundle = await this.chainAdapter.getProvenanceBundle(batch.id);
    
    // Record scan event
    await this.prisma.scanEvent.create({
      data: {
        batchId: batch.id,
        slug: slug,
        timestamp: new Date(),
      },
    });

    return bundle;
  }
}