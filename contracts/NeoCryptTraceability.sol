// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title NeoCryptTraceability
 * @dev Smart contract for botanical traceability with role-based access control
 */
contract NeoCryptTraceability is AccessControl, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Role definitions
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant PROCESSOR_ROLE = keccak256("PROCESSOR_ROLE");
    bytes32 public constant LAB_ROLE = keccak256("LAB_ROLE");
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant REGULATOR_ROLE = keccak256("REGULATOR_ROLE");

    // Counters for unique IDs
    Counters.Counter private _collectionEventIds;
    Counters.Counter private _processingStepIds;
    Counters.Counter private _qualityTestIds;
    Counters.Counter private _batchIds;

    // Structs
    struct CollectionEvent {
        uint256 id;
        string speciesCode;
        string speciesName;
        string part;
        address collector;
        uint256 timestamp;
        int256 latitude;
        int256 longitude;
        string geohash;
        uint256 gpsAccuracy;
        string harvestMethod;
        uint256 moisturePct;
        uint256 foreignMatterPct;
        string rulesVersion;
        string regionId;
        uint256 weightKg;
        bool isActive;
    }

    struct ProcessingStep {
        uint256 id;
        uint256[] inputRefs;
        string processType;
        uint256 timestampStart;
        uint256 timestampEnd;
        uint256 tempC;
        uint256 humidityPct;
        uint256 durationHrs;
        address facility;
        string locationGeohash;
        address operator;
        uint256 outputWeightKg;
        bool isActive;
    }

    struct QualityTest {
        uint256 id;
        uint256 subjectRef;
        address labOrg;
        string testType;
        string specVersion;
        string resultValue;
        string resultUnit;
        bool pass;
        string methodRef;
        string artifactRef;
        string artifactHash;
        uint256 timestamp;
        bool isActive;
    }

    struct Batch {
        uint256 id;
        address manufacturer;
        uint256[] inputs;
        string lotCode;
        string[] qaGates;
        BatchStatus status;
        string qrSerial;
        string publicSlug;
        uint256 createdAt;
        uint256 updatedAt;
        string recallReason;
    }

    struct RuleSet {
        string speciesCode;
        string regionId;
        string[] geohashPrefixes;
        Season[] seasons;
        uint256 quotaPerSeason;
        string version;
        bool isActive;
    }

    struct Season {
        string startDate; // MM-DD format
        string endDate;   // MM-DD format
    }

    enum BatchStatus { Draft, Minted, Released, Flagged, Recalled }

    // Storage mappings
    mapping(uint256 => CollectionEvent) public collectionEvents;
    mapping(uint256 => ProcessingStep) public processingSteps;
    mapping(uint256 => QualityTest) public qualityTests;
    mapping(uint256 => Batch) public batches;
    mapping(string => RuleSet) public ruleSets; // speciesCode => RuleSet
    mapping(string => uint256) public quotaCounters; // species_region_season => used amount

    // Events
    event CollectionEventCreated(uint256 indexed id, string speciesCode, address collector);
    event ProcessingStepAdded(uint256 indexed id, string processType, address facility);
    event QualityTestAdded(uint256 indexed id, string testType, bool pass, address lab);
    event BatchCreated(uint256 indexed id, string lotCode, address manufacturer);
    event BatchMinted(uint256 indexed id, string qrSerial, string publicSlug);
    event BatchRecalled(uint256 indexed id, string reason);
    event RuleSetUpdated(string speciesCode, string version);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REGULATOR_ROLE, msg.sender);
    }

    // Modifiers
    modifier onlyFarmer() {
        require(hasRole(FARMER_ROLE, msg.sender), "Caller is not a farmer");
        _;
    }

    modifier onlyProcessor() {
        require(hasRole(PROCESSOR_ROLE, msg.sender), "Caller is not a processor");
        _;
    }

    modifier onlyLab() {
        require(hasRole(LAB_ROLE, msg.sender), "Caller is not a lab");
        _;
    }

    modifier onlyManufacturer() {
        require(hasRole(MANUFACTURER_ROLE, msg.sender), "Caller is not a manufacturer");
        _;
    }

    modifier onlyRegulator() {
        require(hasRole(REGULATOR_ROLE, msg.sender), "Caller is not a regulator");
        _;
    }

    // Collection Events
    function createCollectionEvent(
        string memory _speciesCode,
        string memory _speciesName,
        string memory _part,
        int256 _latitude,
        int256 _longitude,
        string memory _geohash,
        uint256 _gpsAccuracy,
        string memory _harvestMethod,
        uint256 _moisturePct,
        uint256 _foreignMatterPct,
        string memory _rulesVersion,
        string memory _regionId,
        uint256 _weightKg
    ) external onlyFarmer nonReentrant returns (uint256) {
        // Validate geofence and season
        require(_validateGeofence(_speciesCode, _geohash), "Location outside allowed geofence");
        require(_validateSeason(_speciesCode), "Collection outside allowed season");
        require(_validateQuota(_speciesCode, _regionId, _weightKg), "Quota exceeded");

        _collectionEventIds.increment();
        uint256 newEventId = _collectionEventIds.current();

        collectionEvents[newEventId] = CollectionEvent({
            id: newEventId,
            speciesCode: _speciesCode,
            speciesName: _speciesName,
            part: _part,
            collector: msg.sender,
            timestamp: block.timestamp,
            latitude: _latitude,
            longitude: _longitude,
            geohash: _geohash,
            gpsAccuracy: _gpsAccuracy,
            harvestMethod: _harvestMethod,
            moisturePct: _moisturePct,
            foreignMatterPct: _foreignMatterPct,
            rulesVersion: _rulesVersion,
            regionId: _regionId,
            weightKg: _weightKg,
            isActive: true
        });

        // Update quota counter
        string memory quotaKey = string(abi.encodePacked(_speciesCode, "_", _regionId, "_", _getCurrentSeason()));
        quotaCounters[quotaKey] += _weightKg;

        emit CollectionEventCreated(newEventId, _speciesCode, msg.sender);
        return newEventId;
    }

    // Processing Steps
    function addProcessingStep(
        uint256[] memory _inputRefs,
        string memory _processType,
        uint256 _timestampStart,
        uint256 _timestampEnd,
        uint256 _tempC,
        uint256 _humidityPct,
        uint256 _durationHrs,
        string memory _locationGeohash,
        uint256 _outputWeightKg
    ) external onlyProcessor nonReentrant returns (uint256) {
        // Validate input references exist
        for (uint i = 0; i < _inputRefs.length; i++) {
            require(_inputRefs[i] > 0 && _inputRefs[i] <= _collectionEventIds.current(), "Invalid input reference");
        }

        _processingStepIds.increment();
        uint256 newStepId = _processingStepIds.current();

        processingSteps[newStepId] = ProcessingStep({
            id: newStepId,
            inputRefs: _inputRefs,
            processType: _processType,
            timestampStart: _timestampStart,
            timestampEnd: _timestampEnd,
            tempC: _tempC,
            humidityPct: _humidityPct,
            durationHrs: _durationHrs,
            facility: msg.sender,
            locationGeohash: _locationGeohash,
            operator: msg.sender,
            outputWeightKg: _outputWeightKg,
            isActive: true
        });

        emit ProcessingStepAdded(newStepId, _processType, msg.sender);
        return newStepId;
    }

    // Quality Tests
    function addQualityTest(
        uint256 _subjectRef,
        string memory _testType,
        string memory _specVersion,
        string memory _resultValue,
        string memory _resultUnit,
        bool _pass,
        string memory _methodRef,
        string memory _artifactRef,
        string memory _artifactHash
    ) external onlyLab nonReentrant returns (uint256) {
        require(_subjectRef > 0, "Invalid subject reference");

        _qualityTestIds.increment();
        uint256 newTestId = _qualityTestIds.current();

        qualityTests[newTestId] = QualityTest({
            id: newTestId,
            subjectRef: _subjectRef,
            labOrg: msg.sender,
            testType: _testType,
            specVersion: _specVersion,
            resultValue: _resultValue,
            resultUnit: _resultUnit,
            pass: _pass,
            methodRef: _methodRef,
            artifactRef: _artifactRef,
            artifactHash: _artifactHash,
            timestamp: block.timestamp,
            isActive: true
        });

        emit QualityTestAdded(newTestId, _testType, _pass, msg.sender);
        return newTestId;
    }

    // Batch Management
    function createBatch(
        uint256[] memory _inputs,
        string memory _lotCode,
        string[] memory _qaGates
    ) external onlyManufacturer nonReentrant returns (uint256) {
        _batchIds.increment();
        uint256 newBatchId = _batchIds.current();

        batches[newBatchId] = Batch({
            id: newBatchId,
            manufacturer: msg.sender,
            inputs: _inputs,
            lotCode: _lotCode,
            qaGates: _qaGates,
            status: BatchStatus.Draft,
            qrSerial: "",
            publicSlug: "",
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            recallReason: ""
        });

        emit BatchCreated(newBatchId, _lotCode, msg.sender);
        return newBatchId;
    }

    function mintBatch(
        uint256 _batchId,
        string memory _qrSerial,
        string memory _publicSlug
    ) external onlyManufacturer nonReentrant {
        require(_batchId > 0 && _batchId <= _batchIds.current(), "Invalid batch ID");
        require(batches[_batchId].manufacturer == msg.sender, "Not batch owner");
        require(batches[_batchId].status == BatchStatus.Draft, "Batch already minted");
        require(_validateQAGates(_batchId), "QA gates not satisfied");

        batches[_batchId].status = BatchStatus.Minted;
        batches[_batchId].qrSerial = _qrSerial;
        batches[_batchId].publicSlug = _publicSlug;
        batches[_batchId].updatedAt = block.timestamp;

        emit BatchMinted(_batchId, _qrSerial, _publicSlug);
    }

    function recallBatch(uint256 _batchId, string memory _reason) external onlyRegulator nonReentrant {
        require(_batchId > 0 && _batchId <= _batchIds.current(), "Invalid batch ID");
        require(batches[_batchId].status == BatchStatus.Minted || batches[_batchId].status == BatchStatus.Released, "Cannot recall batch");

        batches[_batchId].status = BatchStatus.Recalled;
        batches[_batchId].recallReason = _reason;
        batches[_batchId].updatedAt = block.timestamp;

        emit BatchRecalled(_batchId, _reason);
    }

    // Rule Management
    function updateRuleSet(
        string memory _speciesCode,
        string memory _regionId,
        string[] memory _geohashPrefixes,
        Season[] memory _seasons,
        uint256 _quotaPerSeason,
        string memory _version
    ) external onlyRegulator {
        RuleSet storage ruleSet = ruleSets[_speciesCode];
        ruleSet.speciesCode = _speciesCode;
        ruleSet.regionId = _regionId;
        ruleSet.geohashPrefixes = _geohashPrefixes;
        ruleSet.seasons = _seasons;
        ruleSet.quotaPerSeason = _quotaPerSeason;
        ruleSet.version = _version;
        ruleSet.isActive = true;

        emit RuleSetUpdated(_speciesCode, _version);
    }

    // View Functions
    function getCollectionEvent(uint256 _id) external view returns (CollectionEvent memory) {
        return collectionEvents[_id];
    }

    function getProcessingStep(uint256 _id) external view returns (ProcessingStep memory) {
        return processingSteps[_id];
    }

    function getQualityTest(uint256 _id) external view returns (QualityTest memory) {
        return qualityTests[_id];
    }

    function getBatch(uint256 _id) external view returns (Batch memory) {
        return batches[_id];
    }

    function getRuleSet(string memory _speciesCode) external view returns (RuleSet memory) {
        return ruleSets[_speciesCode];
    }

    function getTotalCollectionEvents() external view returns (uint256) {
        return _collectionEventIds.current();
    }

    function getTotalProcessingSteps() external view returns (uint256) {
        return _processingStepIds.current();
    }

    function getTotalQualityTests() external view returns (uint256) {
        return _qualityTestIds.current();
    }

    function getTotalBatches() external view returns (uint256) {
        return _batchIds.current();
    }

    // Internal validation functions
    function _validateGeofence(string memory _speciesCode, string memory _geohash) internal view returns (bool) {
        RuleSet memory ruleSet = ruleSets[_speciesCode];
        if (!ruleSet.isActive) return false;

        for (uint i = 0; i < ruleSet.geohashPrefixes.length; i++) {
            if (_startsWith(_geohash, ruleSet.geohashPrefixes[i])) {
                return true;
            }
        }
        return false;
    }

    function _validateSeason(string memory _speciesCode) internal view returns (bool) {
        RuleSet memory ruleSet = ruleSets[_speciesCode];
        if (!ruleSet.isActive) return false;

        string memory currentDate = _getCurrentDate();
        for (uint i = 0; i < ruleSet.seasons.length; i++) {
            if (_isDateInRange(currentDate, ruleSet.seasons[i].startDate, ruleSet.seasons[i].endDate)) {
                return true;
            }
        }
        return false;
    }

    function _validateQuota(string memory _speciesCode, string memory _regionId, uint256 _weightKg) internal view returns (bool) {
        RuleSet memory ruleSet = ruleSets[_speciesCode];
        if (!ruleSet.isActive) return false;

        string memory quotaKey = string(abi.encodePacked(_speciesCode, "_", _regionId, "_", _getCurrentSeason()));
        uint256 currentUsed = quotaCounters[quotaKey];
        
        return (currentUsed + _weightKg) <= ruleSet.quotaPerSeason;
    }

    function _validateQAGates(uint256 _batchId) internal view returns (bool) {
        Batch memory batch = batches[_batchId];
        
        // Check if all required QA gates have passing tests
        for (uint i = 0; i < batch.qaGates.length; i++) {
            bool hasPassingTest = false;
            
            // Check all quality tests for this batch's inputs
            for (uint j = 1; j <= _qualityTestIds.current(); j++) {
                QualityTest memory test = qualityTests[j];
                if (test.isActive && test.pass && 
                    keccak256(bytes(test.testType)) == keccak256(bytes(batch.qaGates[i]))) {
                    
                    // Check if test is for one of the batch inputs
                    for (uint k = 0; k < batch.inputs.length; k++) {
                        if (test.subjectRef == batch.inputs[k]) {
                            hasPassingTest = true;
                            break;
                        }
                    }
                    if (hasPassingTest) break;
                }
            }
            
            if (!hasPassingTest) return false;
        }
        
        return true;
    }

    // Utility functions (simplified for demo)
    function _startsWith(string memory _str, string memory _prefix) internal pure returns (bool) {
        bytes memory strBytes = bytes(_str);
        bytes memory prefixBytes = bytes(_prefix);
        
        if (prefixBytes.length > strBytes.length) return false;
        
        for (uint i = 0; i < prefixBytes.length; i++) {
            if (strBytes[i] != prefixBytes[i]) return false;
        }
        
        return true;
    }

    function _getCurrentDate() internal view returns (string memory) {
        // Simplified: return current month-day (MM-DD)
        // In production, use proper date library
        return "01-15"; // Mock current date
    }

    function _getCurrentSeason() internal view returns (string memory) {
        // Simplified: return current year as season ID
        return "2024";
    }

    function _isDateInRange(string memory _date, string memory _start, string memory _end) internal pure returns (bool) {
        // Simplified date comparison for demo
        // In production, implement proper date parsing and comparison
        return true;
    }
}