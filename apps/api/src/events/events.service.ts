import { Injectable, BadRequestException } from '@nestjs/common';
import { MockChainAdapter } from '@neocrypt/chain-adapter';
import { PrismaService } from '../prisma/prisma.service';
import type { CollectionEvent, ProcessingStep, QualityTest, CustodyEvent } from '@neocrypt/schemas';

@Injectable()
export class EventsService {
  private chainAdapter: MockChainAdapter;

  constructor(private prisma: PrismaService) {
    this.chainAdapter = new MockChainAdapter();
    
    // Listen to chain events and project to read models
    this.chainAdapter.on('collectionEvent', this.handleCollectionEvent.bind(this));
    this.chainAdapter.on('processingStep', this.handleProcessingStep.bind(this));
    this.chainAdapter.on('qualityTest', this.handleQualityTest.bind(this));
    this.chainAdapter.on('custodyEvent', this.handleCustodyEvent.bind(this));
  }

  async createCollectionEvent(event: CollectionEvent): Promise<string> {
    try {
      return await this.chainAdapter.registerCollectionEvent(event);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createProcessingStep(step: ProcessingStep): Promise<string> {
    try {
      return await this.chainAdapter.addProcessingStep(step);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createQualityTest(test: QualityTest): Promise<string> {
    try {
      return await this.chainAdapter.addQualityTest(test);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createCustodyEvent(custody: CustodyEvent): Promise<string> {
    try {
      return await this.chainAdapter.transferCustody(custody);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async handleCollectionEvent(event: CollectionEvent) {
    await this.prisma.collectionEvent.create({
      data: {
        id: event.id,
        speciesCode: event.speciesCode,
        speciesName: event.speciesName,
        part: event.part,
        orgId: event.orgId,
        collectorId: event.collectorId,
        timestamp: event.timestamp,
        lat: event.lat,
        lon: event.lon,
        geohash: event.geohash,
        gpsAccuracy: event.gpsAccuracy,
        harvestMethod: event.harvestMethod,
        permitsRef: event.permitsRef,
        mediaRefs: event.mediaRefs,
        moisturePct: event.initialQuality.moisturePct,
        foreignMatterPct: event.initialQuality.foreignMatterPct,
        rulesVersion: event.rulesVersion,
        regionId: event.regionId,
        weightKg: event.weightKg,
      },
    });
  }

  private async handleProcessingStep(step: ProcessingStep) {
    await this.prisma.processingStep.create({
      data: {
        id: step.id,
        inputRefs: step.inputRefs,
        type: step.type,
        timestampStart: step.timestampStart,
        timestampEnd: step.timestampEnd,
        tempC: step.conditions.tempC,
        humidityPct: step.conditions.humidityPct,
        durationHrs: step.conditions.durationHrs,
        facilityId: step.facilityId,
        locationGeohash: step.locationGeohash,
        operatorId: step.operatorId,
        mediaRefs: step.mediaRefs,
        outputWeightKg: step.outputWeightKg,
      },
    });
  }

  private async handleQualityTest(test: QualityTest) {
    await this.prisma.qualityTest.create({
      data: {
        id: test.id,
        subjectRef: test.subjectRef,
        labOrgId: test.labOrgId,
        testType: test.testType,
        specVersion: test.specVersion,
        resultValue: test.result.value.toString(),
        resultUnit: test.result.unit,
        pass: test.result.pass,
        methodRef: test.result.methodRef,
        artifactRef: test.artifactRef,
        artifactHash: test.artifactHash,
        verifiableCredentialRef: test.verifiableCredentialRef,
        timestamp: test.timestamp,
      },
    });
  }

  private async handleCustodyEvent(custody: CustodyEvent) {
    await this.prisma.custodyEvent.create({
      data: {
        id: custody.id,
        fromOrgId: custody.fromOrgId,
        toOrgId: custody.toOrgId,
        subjectRefs: custody.subjectRefs,
        weighmentKg: custody.weighmentKg,
        transportMeta: custody.transportMeta,
        timestamp: custody.timestamp,
      },
    });
  }
}