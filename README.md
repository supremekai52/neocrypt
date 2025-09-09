# NeoCrypt - Botanical Traceability Platform

A production-quality React application with Solidity smart contracts for blockchain-based traceability of Ayurvedic herbs and botanical products. Built with modern web technologies and designed for easy integration with Ethereum-compatible networks.

## 🏗 Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Collector PWA  │    │ Stakeholder      │    │ Consumer Portal │
│  (Offline-first)│    │ Dashboard        │    │ (Public QR)     │
└─────────┬───────┘    └────────┬─────────┘    └─────────┬───────┘
          │                     │                        │
          └─────────────────────┼────────────────────────┘
                                │
                    ┌───────────▼────────────┐
                    │      React Frontend    │
                    │   (Glass Morphism UI)  │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │   Solidity Contracts   │
                    │ (Ethereum Compatible)  │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │    Blockchain Network  │
                    │ (Local/Testnet/Mainnet)│
                    └────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask browser extension
- Git

### Setup and Run

```bash
# 1. Clone the repository
git clone <repository-url>
cd neocrypt-platform

# 2. Install dependencies
npm install

# 3. Start local blockchain (optional - for development)
npm run start-blockchain

# 4. Deploy smart contracts
npm run deploy-contracts

# 5. Start the application
npm run dev
```

### Access Points

- **Landing Page**: http://localhost:5173
- **Dashboard**: http://localhost:5173/dashboard
- **Collector PWA**: http://localhost:5173/collector
- **Consumer Portal**: http://localhost:5173/consumer
- **Login**: http://localhost:5173/login

## 📱 Applications

### 1. Landing Page
Glass morphism design with application navigation and feature overview.

### 2. Collector PWA
- **Tech**: React PWA, IndexedDB, Service Workers
- **Features**: GPS tracking, offline sync, photo capture, quality logging
- **Users**: Farmers, Wild collectors

### 3. Dashboard
- **Tech**: React, Glass UI, Web3 integration
- **Features**: Event management, batch creation, QR generation, analytics
- **Users**: Processors, Labs, Manufacturers, Regulators

### 4. Consumer Portal
- **Tech**: React SSR-ready
- **Features**: QR scanning, provenance timeline, certificates, recall notices
- **Users**: End consumers, general public

### 5. Smart Contracts
- **Tech**: Solidity 0.8.19, OpenZeppelin
- **Features**: RBAC, geofencing, seasonal controls, quality gates
- **Networks**: Local, Sepolia, Polygon

## 🔐 Authentication & RBAC

### Demo Users (all passwords: `demo`)
- **farmer@demo.com** - Collection events, custody transfers
- **processor@demo.com** - Processing steps, facility management
- **lab@demo.com** - Quality tests, certificate issuance
- **manufacturer@demo.com** - Batch creation, QR minting
- **regulator@demo.com** - Rules management, compliance oversight

### Role Permissions
- **FARMER**: Create collection events, transfer custody
- **PROCESSOR**: Add processing steps, manage facilities
- **LAB**: Conduct quality tests, issue certificates
- **MANUFACTURER**: Create batches, mint QR codes
- **REGULATOR**: Manage rules, view all data

## 🌱 Demo Flow

1. **Collection** (`farmer@demo.com`)
   - Farmer collects Ashwagandha roots with GPS tracking
   - System validates geofence, season, and quota constraints
   - Initial quality measurements recorded

2. **Processing** (`processor@demo.com`)
   - Drying step with temperature/humidity monitoring
   - Grinding and storage operations
   - Weight tracking through supply chain

3. **Quality Testing** (`lab@demo.com`)
   - Moisture content, pesticide, heavy metal tests
   - Digital certificates with artifact hashing
   - Pass/fail validation for QA gates

4. **Batch Creation** (`manufacturer@demo.com`)
   - Combine processed inputs into final batch
   - Define bill of materials and formulation
   - Run QA gate validations

5. **QR Minting**
   - Generate unique QR codes and public slugs
   - Create printable labels for packaging
   - Enable consumer traceability

6. **Consumer Scanning** (Public)
   - Scan QR code to access provenance timeline
   - View collection region, processing steps, certificates
   - Check for recalls and compliance status

## 🔗 Smart Contract Integration

### Contract Features
- **Role-Based Access Control**: Farmer, Processor, Lab, Manufacturer, Regulator roles
- **Geofencing Validation**: GPS coordinates validated against allowed regions
- **Seasonal Controls**: Harvest windows enforced per species/region
- **Quality Gates**: Configurable test requirements before batch minting
- **Quota Management**: Seasonal limits tracked and enforced

### Deployment
```bash
# Deploy to local network
npm run deploy-contracts

# Deploy to Sepolia testnet
SEPOLIA_URL=<your-rpc-url> PRIVATE_KEY=<your-private-key> npm run deploy-contracts -- --network sepolia

# Deploy to Polygon
POLYGON_URL=<your-rpc-url> PRIVATE_KEY=<your-private-key> npm run deploy-contracts -- --network polygon
```

### Contract Addresses
After deployment, contract addresses are saved to `deployments/NeoCryptTraceability.json`

## 🛠 Development

### Environment Setup
```bash
# Copy environment template
cp .env.example .env
# Edit .env with your configuration
```

### Smart Contract Development
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start local blockchain
npx hardhat node
```

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 External Requirements Guide

To fully implement this platform, you'll need the following external services and APIs:

### 1. Blockchain Infrastructure
**Required:**
- **Ethereum RPC Provider**: Infura, Alchemy, or QuickNode
  - Get API key from: https://infura.io or https://alchemy.com
  - Add to `.env` as `SEPOLIA_URL` or `POLYGON_URL`
- **Private Key**: For contract deployment
  - Generate using MetaMask or hardware wallet
  - Add to `.env` as `PRIVATE_KEY` (keep secure!)

### 2. GPS & Mapping Services
**Required:**
- **Geolocation API**: Built into browsers (no API key needed)
- **Map Tiles**: OpenStreetMap (free) or Mapbox
  - Mapbox API key: https://mapbox.com
  - Add to `.env` as `VITE_MAPBOX_TOKEN`

**Optional:**
- **Geocoding Service**: Convert coordinates to addresses
  - Google Maps API: https://developers.google.com/maps
  - OpenCage API: https://opencagedata.com

### 3. File Storage (for photos/certificates)
**Options:**
- **IPFS**: Decentralized storage
  - Pinata: https://pinata.cloud
  - Web3.Storage: https://web3.storage
- **Cloud Storage**: 
  - AWS S3, Google Cloud Storage, or Cloudinary
  - Get API keys from respective providers

### 4. SMS Gateway (for low-connectivity areas)
**Options:**
- **Twilio**: https://twilio.com
  - Get Account SID and Auth Token
- **Gupshup**: https://gupshup.io (India-focused)
- **Exotel**: https://exotel.com (India-focused)

### 5. QR Code Generation
**Built-in**: Uses `qrcode` npm package (no external API needed)

### 6. Certificate Verification
**Options:**
- **Verifiable Credentials**: 
  - Microsoft ION: https://identity.foundation/ion/
  - Ceramic Network: https://ceramic.network
- **Digital Signatures**:
  - DocuSign API: https://developers.docusign.com
  - Adobe Sign API: https://adobe.io/apis/documentcloud/sign

### 7. Weather Data (for seasonal validation)
**Options:**
- **OpenWeatherMap**: https://openweathermap.org/api
- **WeatherAPI**: https://weatherapi.com
- **AccuWeather**: https://developer.accuweather.com

### 8. Analytics & Monitoring
**Options:**
- **Google Analytics**: https://analytics.google.com
- **Mixpanel**: https://mixpanel.com
- **Sentry**: https://sentry.io (error tracking)

## 🔧 Configuration

### Environment Variables
```bash
# Blockchain
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
POLYGON_URL=https://polygon-rpc.com
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key

# Frontend
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud
VITE_API_BASE_URL=http://localhost:3001

# SMS (optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Storage (optional)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=your_bucket_name
```

## 🧪 Testing

### Smart Contract Tests
```bash
# Run contract tests
npx hardhat test

# Test with coverage
npx hardhat coverage
```

### Frontend Tests
```bash
# Run component tests
npm test

# Run E2E tests
npm run test:e2e
```

## 📐 Rules & Validation

### Geofencing
- Species restricted to specific geohash prefixes
- GPS accuracy thresholds enforced
- Location validation at collection time

### Seasonal Controls
- Harvest windows defined per species/region
- Date range validation with year boundary support
- Quota tracking and enforcement

### Quality Gates
- Configurable test requirements per batch type
- Pass/fail validation before minting
- Certificate verification integration

## 🌍 Production Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Smart Contract Deployment
```bash
# Deploy to mainnet (be careful!)
POLYGON_URL=<mainnet-rpc> PRIVATE_KEY=<your-key> npm run deploy-contracts -- --network polygon
```

### Security Considerations
- Store private keys securely (use hardware wallets for production)
- Implement rate limiting for public endpoints
- Use HTTPS for all communications
- Regular security audits for smart contracts
- GPS data anonymization in public views

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with:** React • Solidity • Ethers.js • Vite • Glass Morphism Design

**Ready for:** Ethereum • Polygon • Production Deployment • Enterprise Integration

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `/docs`
- Review the smart contract code in `/contracts`

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with ERP systems
- [ ] Advanced certificate verification
- [ ] Machine learning for quality prediction
- [ ] IoT sensor integration
- [ ] Supply chain financing features