import type { 
  CollectionEvent, 
  ProcessingStep, 
  QualityTest, 
  CustodyEvent, 
  Batch,
  ProvenanceBundle 
} from '@neocrypt/schemas';

export interface IChainAdapter {
  // Event operations
  registerCollectionEvent(event: CollectionEvent): Promise<string>;
  addProcessingStep(step: ProcessingStep): Promise<string>;
  addQualityTest(test: QualityTest): Promise<string>;
  transferCustody(custody: CustodyEvent): Promise<string>;
  
  // Batch operations
  createBatch(inputs: Array<{refId: string, weightKg: number}>, bom: any): Promise<string>;
  mintBatch(batchId: string): Promise<{qrSerial: string, slug: string, qrPngDataUrl: string}>;
  flagBatchRecall(batchId: string, reason: string): Promise<void>;
  
  // Query operations
  getProvenanceBundle(batchId: string): Promise<ProvenanceBundle | null>;
  getBatchBySlug(slug: string): Promise<Batch | null>;
  getDashboards(params: DashboardParams): Promise<DashboardData>;
}

export interface DashboardParams {
  species?: string;
  region?: string;
  from?: string;
  to?: string;
  orgId?: string;
}

export interface DashboardData {
  metrics: {
    eventsToday: number;
    batchesMinted: number;
    recalls: number;
    totalWeight: number;
  };
  recentEvents: Array<{
    id: string;
    type: string;
    timestamp: string;
    details: string;
  }>;
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
}