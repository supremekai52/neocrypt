import { z } from 'zod';

// Base schemas
export const BaseEntitySchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Organization Schema
export const OrganizationSchema = BaseEntitySchema.extend({
  name: z.string(),
  type: z.enum(['FARM_COOP', 'PROCESSOR', 'LAB', 'MANUFACTURER', 'REGULATOR']),
  licenseNumber: z.string().optional(),
  address: z.string(),
  geohash: z.string().optional(),
  contactEmail: z.string().email(),
  isActive: z.boolean().default(true),
});

// User Schema
export const UserSchema = BaseEntitySchema.extend({
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['FARMER', 'PROCESSOR', 'LAB', 'MANUFACTURER', 'REGULATOR', 'VIEWER']),
  orgId: z.string(),
  isActive: z.boolean().default(true),
});

// Collection Event Schema
export const CollectionEventSchema = BaseEntitySchema.extend({
  speciesCode: z.string(),
  speciesName: z.string(),
  part: z.enum(['ROOT', 'LEAF', 'SEED', 'BARK', 'FLOWER', 'WHOLE_PLANT']),
  orgId: z.string(),
  collectorId: z.string(),
  timestamp: z.string().datetime(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  geohash: z.string(),
  gpsAccuracy: z.number().positive(),
  harvestMethod: z.enum(['CULTIVATED', 'WILD']),
  permitsRef: z.string().optional(),
  mediaRefs: z.array(z.string()).default([]),
  initialQuality: z.object({
    moisturePct: z.number().min(0).max(100),
    foreignMatterPct: z.number().min(0).max(100).optional(),
  }),
  rulesVersion: z.string(),
  regionId: z.string(),
  weightKg: z.number().positive(),
});

// Processing Step Schema
export const ProcessingStepSchema = BaseEntitySchema.extend({
  inputRefs: z.array(z.string()),
  type: z.enum(['DRYING', 'GRINDING', 'STORAGE', 'PACKING']),
  timestampStart: z.string().datetime(),
  timestampEnd: z.string().datetime(),
  conditions: z.object({
    tempC: z.number().optional(),
    humidityPct: z.number().min(0).max(100).optional(),
    durationHrs: z.number().positive().optional(),
  }),
  facilityId: z.string(),
  locationGeohash: z.string(),
  operatorId: z.string(),
  mediaRefs: z.array(z.string()).default([]),
  outputWeightKg: z.number().positive(),
});

// Quality Test Schema
export const QualityTestSchema = BaseEntitySchema.extend({
  subjectRef: z.string(),
  labOrgId: z.string(),
  testType: z.enum(['MOISTURE', 'PESTICIDE', 'DNA', 'HEAVY_METAL', 'MICROBIAL']),
  specVersion: z.string(),
  result: z.object({
    value: z.union([z.number(), z.string()]),
    unit: z.string().optional(),
    pass: z.boolean(),
    methodRef: z.string().optional(),
  }),
  artifactRef: z.string(),
  artifactHash: z.string(),
  verifiableCredentialRef: z.string().optional(),
  timestamp: z.string().datetime(),
});

// Custody Event Schema
export const CustodyEventSchema = BaseEntitySchema.extend({
  fromOrgId: z.string(),
  toOrgId: z.string(),
  subjectRefs: z.array(z.string()),
  weighmentKg: z.number().positive(),
  transportMeta: z.record(z.any()).optional(),
  timestamp: z.string().datetime(),
});

// Batch Schema
export const BatchSchema = BaseEntitySchema.extend({
  manufacturerOrgId: z.string(),
  inputs: z.array(z.object({
    refId: z.string(),
    weightKg: z.number().positive(),
  })),
  bom: z.object({
    formulation: z.array(z.object({
      ingredientId: z.string().optional(),
      batchId: z.string().optional(),
      grams: z.number().positive().optional(),
      pct: z.number().min(0).max(100).optional(),
    })),
    lotCode: z.string(),
  }),
  qaGates: z.array(z.string()),
  status: z.enum(['DRAFT', 'MINTED', 'RELEASED', 'FLAGGED', 'RECALLED']),
  qrSerial: z.string().optional(),
  publicSlug: z.string().optional(),
  recallReason: z.string().optional(),
});

// Provenance Bundle Schema (Public)
export const ProvenanceBundleSchema = z.object({
  bundleId: z.string(),
  batchId: z.string(),
  summary: z.object({
    species: z.string(),
    manufacturer: z.string(),
    status: z.string(),
    lot: z.string(),
  }),
  map: z.object({
    region: z.string(),
    centroidGeohash: z.string(),
  }),
  timeline: z.array(z.object({
    t: z.string().datetime(),
    type: z.string(),
    detail: z.string().optional(),
    region: z.string().optional(),
    link: z.string().optional(),
  })),
  compliance: z.object({
    nmPbRules: z.string(),
    fairTrade: z.boolean().optional(),
    certificates: z.array(z.object({
      name: z.string(),
      sha256: z.string(),
      url: z.string(),
    })),
  }),
});

// Rule Set Schema
export const RuleSetSchema = BaseEntitySchema.extend({
  speciesCode: z.string(),
  regionId: z.string(),
  geohashPrefixes: z.array(z.string()),
  seasons: z.array(z.object({
    start: z.string().regex(/^\d{2}-\d{2}$/), // MM-DD format
    end: z.string().regex(/^\d{2}-\d{2}$/),
  })),
  quotaPerSeason: z.number().positive(),
  version: z.string(),
});

// Export types
export type Organization = z.infer<typeof OrganizationSchema>;
export type User = z.infer<typeof UserSchema>;
export type CollectionEvent = z.infer<typeof CollectionEventSchema>;
export type ProcessingStep = z.infer<typeof ProcessingStepSchema>;
export type QualityTest = z.infer<typeof QualityTestSchema>;
export type CustodyEvent = z.infer<typeof CustodyEventSchema>;
export type Batch = z.infer<typeof BatchSchema>;
export type ProvenanceBundle = z.infer<typeof ProvenanceBundleSchema>;
export type RuleSet = z.infer<typeof RuleSetSchema>;

// Test data factories
export const createMockOrganization = (overrides: Partial<Organization> = {}): Organization => ({
  id: 'org_' + Math.random().toString(36).substr(2, 9),
  name: 'Test Organization',
  type: 'FARM_COOP',
  address: '123 Test St, Test City',
  contactEmail: 'test@example.com',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockCollectionEvent = (overrides: Partial<CollectionEvent> = {}): CollectionEvent => ({
  id: 'event_' + Math.random().toString(36).substr(2, 9),
  speciesCode: 'ASHW',
  speciesName: 'Withania somnifera',
  part: 'ROOT',
  orgId: 'org_test',
  collectorId: 'collector_test',
  timestamp: new Date().toISOString(),
  lat: 26.2389,
  lon: 73.0243,
  geohash: 'tsj2d',
  gpsAccuracy: 5.0,
  harvestMethod: 'CULTIVATED',
  mediaRefs: [],
  initialQuality: {
    moisturePct: 12.5,
    foreignMatterPct: 2.1,
  },
  rulesVersion: '1.0',
  regionId: 'jodhpur_rajasthan',
  weightKg: 50.0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});