import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { MockChainAdapter } from '@neocrypt/chain-adapter';
import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode';

@Injectable()
export class BatchesService {
  private chainAdapter: MockChainAdapter;

  constructor(private prisma: PrismaService) {
    this.chainAdapter = new MockChainAdapter();
    
    this.chainAdapter.on('batchCreated', this.handleBatchCreated.bind(this));
    this.chainAdapter.on('batchMinted', this.handleBatchMinted.bind(this));
    this.chainAdapter.on('batchRecalled', this.handleBatchRecalled.bind(this));
  }

  async createBatch(data: {
    inputs: Array<{refId: string, weightKg: number}>,
    bom: any,
    manufacturerOrgId: string,
  }): Promise<string> {
    try {
      return await this.chainAdapter.createBatch(data.inputs, {
        ...data.bom,
        manufacturerOrgId: data.manufacturerOrgId,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async mintBatch(batchId: string): Promise<{qrSerial: string, slug: string, qrPngDataUrl: string}> {
    try {
      const result = await this.chainAdapter.mintBatch(batchId);
      
      // Generate actual QR code
      const qrUrl = `${process.env.NEXT_PUBLIC_PORTAL_BASE || 'http://localhost:3004'}/p/${result.slug}`;
      const qrPngDataUrl = await QRCode.toDataURL(qrUrl);
      
      return {
        ...result,
        qrPngDataUrl,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async recallBatch(batchId: string, reason: string): Promise<void> {
    try {
      await this.chainAdapter.flagBatchRecall(batchId, reason);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getBatches(orgId?: string) {
    return this.prisma.batch.findMany({
      where: orgId ? { manufacturerOrgId: orgId } : undefined,
      include: {
        inputs: {
          include: {
            collectionEvent: true,
            processingStep: true,
          },
        },
        manufacturerOrg: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBatch(id: string) {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: {
        inputs: {
          include: {
            collectionEvent: true,
            processingStep: true,
          },
        },
        manufacturerOrg: true,
      },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    return batch;
  }

  private async handleBatchCreated(batch: any) {
    await this.prisma.batch.create({
      data: {
        id: batch.id,
        manufacturerOrgId: batch.manufacturerOrgId,
        lotCode: batch.bom.lotCode,
        qaGates: batch.qaGates,
        status: batch.status,
      },
    });

    // Create batch inputs
    for (const input of batch.inputs) {
      await this.prisma.batchInput.create({
        data: {
          batchId: batch.id,
          refId: input.refId,
          refType: 'collection', // Simplified for demo
          weightKg: input.weightKg,
        },
      });
    }
  }

  private async handleBatchMinted(batch: any) {
    await this.prisma.batch.update({
      where: { id: batch.id },
      data: {
        status: batch.status,
        qrSerial: batch.qrSerial,
        publicSlug: batch.publicSlug,
        updatedAt: new Date(),
      },
    });
  }

  private async handleBatchRecalled(data: any) {
    await this.prisma.batch.update({
      where: { id: data.batch.id },
      data: {
        status: data.batch.status,
        recallReason: data.reason,
        updatedAt: new Date(),
      },
    });
  }
}