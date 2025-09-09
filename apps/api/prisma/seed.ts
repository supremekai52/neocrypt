import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Organizations
  const orgFarmCoop = await prisma.organization.upsert({
    where: { id: 'org_farm_coop' },
    update: {},
    create: {
      id: 'org_farm_coop',
      name: 'Jodhpur Farmers Cooperative',
      type: 'FARM_COOP',
      licenseNumber: 'FC-RJ-2024-001',
      address: 'Village Balesar, Jodhpur, Rajasthan 342001',
      geohash: 'tsj2d',
      contactEmail: 'info@jodhpurfarmers.coop',
    },
  });

  const orgProcessor = await prisma.organization.upsert({
    where: { id: 'org_processor' },
    update: {},
    create: {
      id: 'org_processor',
      name: 'Rajasthan Herbal Processing Ltd',
      type: 'PROCESSOR',
      licenseNumber: 'PR-RJ-2024-001',
      address: 'Industrial Area Phase 2, Jodhpur, Rajasthan',
      geohash: 'tsj2e',
      contactEmail: 'ops@rajherbal.com',
    },
  });

  const orgLab = await prisma.organization.upsert({
    where: { id: 'org_lab' },
    update: {},
    create: {
      id: 'org_lab',
      name: 'Central Ayurveda Research Laboratory',
      type: 'LAB',
      licenseNumber: 'LAB-NABL-2024-001',
      address: 'AIIMS Campus, Jodhpur, Rajasthan',
      contactEmail: 'testing@carljodhpur.org',
    },
  });

  const orgManufacturer = await prisma.organization.upsert({
    where: { id: 'org_manufacturer' },
    update: {},
    create: {
      id: 'org_manufacturer',
      name: 'Vedic Wellness Pharmaceuticals',
      type: 'MANUFACTURER',
      licenseNumber: 'MFG-FDA-2024-001',
      address: 'Pharmaceutical Park, Jodhpur, Rajasthan',
      contactEmail: 'quality@vedicwellness.com',
    },
  });

  const orgRegulator = await prisma.organization.upsert({
    where: { id: 'org_regulator' },
    update: {},
    create: {
      id: 'org_regulator',
      name: 'Ministry of AYUSH, Rajasthan',
      type: 'REGULATOR',
      address: 'Secretariat, Jaipur, Rajasthan',
      contactEmail: 'ayush.raj@nic.in',
    },
  });

  // Create Users
  await prisma.user.upsert({
    where: { id: 'user_farmer' },
    update: {},
    create: {
      id: 'user_farmer',
      email: 'farmer@demo.com',
      name: 'Ramesh Sharma',
      role: 'FARMER',
      orgId: orgFarmCoop.id,
    },
  });

  await prisma.user.upsert({
    where: { id: 'user_processor' },
    update: {},
    create: {
      id: 'user_processor',
      email: 'processor@demo.com',
      name: 'Priya Patel',
      role: 'PROCESSOR',
      orgId: orgProcessor.id,
    },
  });

  await prisma.user.upsert({
    where: { id: 'user_lab' },
    update: {},
    create: {
      id: 'user_lab',
      email: 'lab@demo.com',
      name: 'Dr. Suresh Kumar',
      role: 'LAB',
      orgId: orgLab.id,
    },
  });

  await prisma.user.upsert({
    where: { id: 'user_manufacturer' },
    update: {},
    create: {
      id: 'user_manufacturer',
      email: 'manufacturer@demo.com',
      name: 'Anjali Singh',
      role: 'MANUFACTURER',
      orgId: orgManufacturer.id,
    },
  });

  await prisma.user.upsert({
    where: { id: 'user_regulator' },
    update: {},
    create: {
      id: 'user_regulator',
      email: 'regulator@demo.com',
      name: 'Vikash Chandra',
      role: 'REGULATOR',
      orgId: orgRegulator.id,
    },
  });

  // Create Rule Sets
  await prisma.ruleSet.upsert({
    where: {
      speciesCode_regionId: {
        speciesCode: 'ASHW',
        regionId: 'jodhpur_rajasthan',
      },
    },
    update: {},
    create: {
      speciesCode: 'ASHW',
      regionId: 'jodhpur_rajasthan',
      geohashPrefixes: ['tsj'],
      seasons: [
        { start: '10-01', end: '12-31' },
        { start: '01-01', end: '03-31' },
      ],
      quotaPerSeason: 1000,
      version: '1.0',
    },
  });

  // Create demo Collection Event
  const collectionEvent = await prisma.collectionEvent.upsert({
    where: { id: 'event_demo_collection' },
    update: {},
    create: {
      id: 'event_demo_collection',
      speciesCode: 'ASHW',
      speciesName: 'Withania somnifera',
      part: 'ROOT',
      orgId: orgFarmCoop.id,
      collectorId: 'user_farmer',
      timestamp: new Date('2024-01-15T08:30:00Z'),
      lat: 26.2389,
      lon: 73.0243,
      geohash: 'tsj2d',
      gpsAccuracy: 3.5,
      harvestMethod: 'CULTIVATED',
      mediaRefs: [],
      moisturePct: 11.5,
      foreignMatterPct: 1.8,
      rulesVersion: '1.0',
      regionId: 'jodhpur_rajasthan',
      weightKg: 50.0,
    },
  });

  // Create demo Processing Step
  const processingStep = await prisma.processingStep.upsert({
    where: { id: 'step_demo_drying' },
    update: {},
    create: {
      id: 'step_demo_drying',
      inputRefs: [collectionEvent.id],
      type: 'DRYING',
      timestampStart: new Date('2024-01-16T09:00:00Z'),
      timestampEnd: new Date('2024-01-18T17:00:00Z'),
      tempC: 45.0,
      humidityPct: 15.0,
      durationHrs: 56.0,
      facilityId: orgProcessor.id,
      locationGeohash: 'tsj2e',
      operatorId: 'user_processor',
      mediaRefs: [],
      outputWeightKg: 12.5,
    },
  });

  // Create demo Quality Test
  await prisma.qualityTest.upsert({
    where: { id: 'test_demo_moisture' },
    update: {},
    create: {
      id: 'test_demo_moisture',
      subjectRef: processingStep.id,
      labOrgId: orgLab.id,
      testType: 'MOISTURE',
      specVersion: 'IS-4831:2013',
      resultValue: '8.2',
      resultUnit: '%',
      pass: true,
      methodRef: 'Oven drying method',
      artifactRef: 'https://example.com/certificates/moisture-test-001.pdf',
      artifactHash: 'sha256:abc123def456...',
      timestamp: new Date('2024-01-20T14:30:00Z'),
    },
  });

  // Create demo Batch
  const batch = await prisma.batch.upsert({
    where: { id: 'batch_demo_001' },
    update: {},
    create: {
      id: 'batch_demo_001',
      manufacturerOrgId: orgManufacturer.id,
      lotCode: 'ASW-2024-001',
      qaGates: ['moisture', 'pesticide'],
      status: 'MINTED',
      qrSerial: 'QR001ASW2024',
      publicSlug: 'ashwagandha-premium-001',
    },
  });

  // Create batch input
  await prisma.batchInput.upsert({
    where: { id: 'input_demo_001' },
    update: {},
    create: {
      id: 'input_demo_001',
      batchId: batch.id,
      refId: processingStep.id,
      refType: 'processing',
      weightKg: 12.5,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('Demo users created:');
  console.log('- farmer@demo.com (password: demo)');
  console.log('- processor@demo.com (password: demo)');
  console.log('- lab@demo.com (password: demo)');
  console.log('- manufacturer@demo.com (password: demo)');
  console.log('- regulator@demo.com (password: demo)');
  console.log('\nDemo batch created with slug: ashwagandha-premium-001');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });