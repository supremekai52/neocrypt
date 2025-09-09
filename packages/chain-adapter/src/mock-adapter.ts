import { EventEmitter } from 'eventemitter3';
import * as geohash from 'geohash';
import type {
  CollectionEvent,
  ProcessingStep,
  QualityTest,
  CustodyEvent,
  Batch,
  ProvenanceBundle,
} from '@neocrypt/schemas';
import type { IChainAdapter, DashboardParams, DashboardData, ValidationError } from './types';

export class MockChainAdapter extends EventEmitter implements IChainAdapter {
  private events: Map<string, CollectionEvent> = new Map();
  private processingSteps: Map<string, ProcessingStep> = new Map();
  private qualityTests: Map<string, QualityTest> = new Map();
  private custodyEvents: Map<string, CustodyEvent> = new Map();
  private batches: Map<string, Batch> = new Map();
  private quotaCounters: Map<string, number> = new Map();

  // Mock rules - in production this would come from database
  private rules = {
    ASHW: {
      regionId: 'jodhpur_rajasthan',
      geohashPrefixes: ['tsj'],
      seasons: [
        { start: '10-01', end: '12-31' },
        { start: '01-01', end: '03-31' }
      ],
      quotaPerSeason: 1000,
      version: '1.0'
    }
  };

  async registerCollectionEvent(event: CollectionEvent): Promise<string> {
    // Validate geofence
    const rule = this.rules[event.speciesCode as keyof typeof this.rules];
    if (!rule) {
      throw this.createValidationError('SPECIES_NOT_CONFIGURED', `Species ${event.speciesCode} not configured`);
    }

    const validGeohash = rule.geohashPrefixes.some(prefix => 
      event.geohash.startsWith(prefix)
    );
    if (!validGeohash) {
      throw this.createValidationError('GEO_FENCE_VIOLATION', 'Location outside allowed geofence');
    }

    // Validate season
    const eventDate = new Date(event.timestamp);
    const monthDay = String(eventDate.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(eventDate.getDate()).padStart(2, '0');
    
    const inSeason = rule.seasons.some(season => {
      if (season.start <= season.end) {
        return monthDay >= season.start && monthDay <= season.end;
      } else {
        // Season crosses year boundary
        return monthDay >= season.start || monthDay <= season.end;
      }
    });
    
    if (!inSeason) {
      throw this.createValidationError('OUT_OF_SEASON', 'Collection outside allowed season');
    }

    // Check quota
    const quotaKey = `${event.speciesCode}_${rule.regionId}_${eventDate.getFullYear()}`;
    const currentQuota = this.quotaCounters.get(quotaKey) || 0;
    if (currentQuota + event.weightKg > rule.quotaPerSeason) {
      throw this.createValidationError('QUOTA_EXCEEDED', 'Seasonal quota exceeded');
    }

    // Update quota
    this.quotaCounters.set(quotaKey, currentQuota + event.weightKg);

    // Store event
    this.events.set(event.id, event);
    this.emit('collectionEvent', event);

    return event.id;
  }

  async addProcessingStep(step: ProcessingStep): Promise<string> {
    // Validate input references exist
    for (const inputRef of step.inputRefs) {
      if (!this.events.has(inputRef) && !this.processingSteps.has(inputRef)) {
        throw this.createValidationError('INVALID_INPUT_REF', `Input reference ${inputRef} not found`);
      }
    }

    this.processingSteps.set(step.id, step);
    this.emit('processingStep', step);
    return step.id;
  }

  async addQualityTest(test: QualityTest): Promise<string> {
    // Mock VC verification
    const vcValid = !test.verifiableCredentialRef?.includes('failVC=true');
    if (!vcValid) {
      throw this.createValidationError('VC_VERIFICATION_FAILED', 'Verifiable credential verification failed');
    }

    this.qualityTests.set(test.id, test);
    this.emit('qualityTest', test);
    return test.id;
  }

  async transferCustody(custody: CustodyEvent): Promise<string> {
    // Validate subject references exist
    for (const subjectRef of custody.subjectRefs) {
      if (!this.events.has(subjectRef) && !this.processingSteps.has(subjectRef)) {
        throw this.createValidationError('INVALID_SUBJECT_REF', `Subject reference ${subjectRef} not found`);
      }
    }

    this.custodyEvents.set(custody.id, custody);
    this.emit('custodyEvent', custody);
    return custody.id;
  }

  async createBatch(inputs: Array<{refId: string, weightKg: number}>, bom: any): Promise<string> {
    const batchId = 'batch_' + Date.now();
    const batch: Batch = {
      id: batchId,
      manufacturerOrgId: bom.manufacturerOrgId || 'org_manufacturer',
      inputs,
      bom,
      qaGates: [],
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.batches.set(batchId, batch);
    this.emit('batchCreated', batch);
    return batchId;
  }

  async mintBatch(batchId: string): Promise<{qrSerial: string, slug: string, qrPngDataUrl: string}> {
    const batch = this.batches.get(batchId);
    if (!batch) {
      throw this.createValidationError('BATCH_NOT_FOUND', 'Batch not found');
    }

    // Mock QA gate validation
    const requiredTests = ['moisture', 'pesticide'];
    for (const testType of requiredTests) {
      const hasPassingTest = Array.from(this.qualityTests.values()).some(test => 
        batch.inputs.some(input => test.subjectRef === input.refId) &&
        test.testType.toLowerCase() === testType &&
        test.result.pass
      );

      if (!hasPassingTest) {
        throw this.createValidationError('QA_GATE_FAILED', `Missing passing ${testType} test`);
      }
    }

    const qrSerial = 'QR' + Date.now();
    const slug = 'batch_' + Math.random().toString(36).substr(2, 9);
    
    // Mock QR PNG generation
    const qrPngDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

    batch.qrSerial = qrSerial;
    batch.publicSlug = slug;
    batch.status = 'MINTED';
    batch.updatedAt = new Date().toISOString();

    this.batches.set(batchId, batch);
    this.emit('batchMinted', batch);

    return { qrSerial, slug, qrPngDataUrl };
  }

  async flagBatchRecall(batchId: string, reason: string): Promise<void> {
    const batch = this.batches.get(batchId);
    if (!batch) {
      throw this.createValidationError('BATCH_NOT_FOUND', 'Batch not found');
    }

    batch.status = 'RECALLED';
    batch.recallReason = reason;
    batch.updatedAt = new Date().toISOString();

    this.batches.set(batchId, batch);
    this.emit('batchRecalled', { batch, reason });
  }

  async getProvenanceBundle(batchId: string): Promise<ProvenanceBundle | null> {
    const batch = this.batches.get(batchId);
    if (!batch) {
      return null;
    }

    // Build timeline from events
    const timeline = [];
    
    // Add collection events
    for (const input of batch.inputs) {
      const event = this.events.get(input.refId);
      if (event) {
        timeline.push({
          t: event.timestamp,
          type: 'Collection',
          detail: `${event.speciesName} (${event.part})`,
          region: event.regionId,
        });
      }
    }

    // Add processing steps
    Array.from(this.processingSteps.values())
      .filter(step => step.inputRefs.some(ref => batch.inputs.some(input => input.refId === ref)))
      .forEach(step => {
        timeline.push({
          t: step.timestampStart,
          type: 'Processing',
          detail: step.type,
        });
      });

    // Add quality tests
    Array.from(this.qualityTests.values())
      .filter(test => batch.inputs.some(input => input.refId === test.subjectRef))
      .forEach(test => {
        timeline.push({
          t: test.timestamp,
          type: 'Quality Test',
          detail: `${test.testType}: ${test.result.pass ? 'PASS' : 'FAIL'}`,
        });
      });

    timeline.sort((a, b) => new Date(a.t).getTime() - new Date(b.t).getTime());

    const bundle: ProvenanceBundle = {
      bundleId: 'bundle_' + batchId,
      batchId,
      summary: {
        species: 'Ashwagandha (Withania somnifera)',
        manufacturer: 'Demo Manufacturer',
        status: batch.status,
        lot: batch.bom.lotCode,
      },
      map: {
        region: 'Jodhpur, Rajasthan',
        centroidGeohash: 'tsj2d',
      },
      timeline,
      compliance: {
        nmPbRules: '1.0',
        fairTrade: true,
        certificates: [
          {
            name: 'Organic Certificate',
            sha256: 'abc123def456...',
            url: '/certificates/organic.pdf',
          }
        ],
      },
    };

    return bundle;
  }

  async getBatchBySlug(slug: string): Promise<Batch | null> {
    return Array.from(this.batches.values()).find(batch => batch.publicSlug === slug) || null;
  }

  async getDashboards(params: DashboardParams): Promise<DashboardData> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const eventsToday = Array.from(this.events.values())
      .filter(event => new Date(event.timestamp) >= today).length;

    const batchesMinted = Array.from(this.batches.values())
      .filter(batch => batch.status === 'MINTED' || batch.status === 'RELEASED').length;

    const recalls = Array.from(this.batches.values())
      .filter(batch => batch.status === 'RECALLED').length;

    const totalWeight = Array.from(this.events.values())
      .reduce((sum, event) => sum + event.weightKg, 0);

    const recentEvents = [
      ...Array.from(this.events.values()).map(event => ({
        id: event.id,
        type: 'Collection',
        timestamp: event.timestamp,
        details: `${event.speciesName} - ${event.weightKg}kg`,
      })),
      ...Array.from(this.processingSteps.values()).map(step => ({
        id: step.id,
        type: 'Processing',
        timestamp: step.timestampStart,
        details: `${step.type} - ${step.outputWeightKg}kg`,
      })),
    ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

    return {
      metrics: {
        eventsToday,
        batchesMinted,
        recalls,
        totalWeight,
      },
      recentEvents,
    };
  }

  private createValidationError(code: string, message: string, field?: string): Error {
    const error = new Error(message) as Error & ValidationError;
    error.code = code;
    error.field = field;
    return error;
  }
}