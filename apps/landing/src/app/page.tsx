'use client'

import { useState } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@neocrypt/ui'
import { 
  Leaf, 
  Shield, 
  Smartphone, 
  BarChart3, 
  QrCode, 
  MessageSquare,
  ChevronRight,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function LandingPage() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null)

  const apps = [
    {
      id: 'collector',
      title: 'Collector PWA',
      description: 'Offline-first mobile app for farmers and collectors',
      icon: Smartphone,
      features: ['GPS Tracking', 'Offline Sync', 'Photo Capture', 'Quality Logging'],
      url: 'http://localhost:3002',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'dashboard',
      title: 'Stakeholder Dashboard',
      description: 'Comprehensive management console for processors and labs',
      icon: BarChart3,
      features: ['Batch Management', 'Quality Tests', 'Analytics', 'Reports'],
      url: 'http://localhost:3003',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      id: 'consumer',
      title: 'Consumer Portal',
      description: 'Public QR code scanning and traceability information',
      icon: QrCode,
      features: ['QR Scanning', 'Provenance Timeline', 'Certificates', 'Recall Notices'],
      url: 'http://localhost:3004',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'api',
      title: 'API Documentation',
      description: 'OpenAPI specification and interactive documentation',
      icon: Shield,
      features: ['REST Endpoints', 'Schema Validation', 'RBAC', 'Blockchain Simulation'],
      url: 'http://localhost:3001/docs',
      gradient: 'from-teal-500 to-cyan-500'
    }
  ]

  const handleEnterApp = (app: any) => {
    window.open(app.url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-400/20 to-teal-400/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-orange-400/10 to-red-400/10 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="w-12 h-12 text-emerald-400 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
              NeoCrypt
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Advanced botanical traceability platform for Ayurvedic herbs using blockchain technology
          </p>
          <div className="flex items-center justify-center mt-6 space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
              Production Ready
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
              TypeScript Monorepo
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
              FHIR Compliant
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Shield,
              title: 'Blockchain Security',
              description: 'Immutable traceability with smart contract validation'
            },
            {
              icon: Leaf,
              title: 'Botanical Focus',
              description: 'Specialized for Ayurvedic herbs and botanical products'
            },
            {
              icon: MessageSquare,
              title: 'SMS Integration',
              description: 'Works in low-connectivity environments via SMS'
            }
          ].map((feature, index) => (
            <Card key={index} glass className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6 text-center">
                <feature.icon className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Applications Grid */}
        <div className="app-grid">
          {apps.map((app, index) => (
            <Card 
              key={app.id} 
              glass 
              className="group hover:scale-105 transition-all duration-300 animate-slide-up cursor-pointer" 
              style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
              onClick={() => setSelectedApp(selectedApp === app.id ? null : app.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${app.gradient} shadow-lg`}>
                    <app.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-xl mb-1">{app.title}</CardTitle>
                    <p className="text-gray-300 text-sm">{app.description}</p>
                  </div>
                  <ChevronRight 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      selectedApp === app.id ? 'rotate-90' : ''
                    }`} 
                  />
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className={`overflow-hidden transition-all duration-300 ${
                  selectedApp === app.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Key Features:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {app.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-400">
                            <CheckCircle className="w-3 h-3 text-emerald-400 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      variant="glass" 
                      className="w-full group-hover:shadow-lg transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEnterApp(app)
                      }}
                    >
                      Enter Application
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Flow */}
        <Card glass className="mt-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">Demo Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { step: '1', title: 'Collect', desc: 'Farmer collects herbs with GPS tracking', icon: Leaf },
                { step: '2', title: 'Process', desc: 'Processing steps are recorded', icon: BarChart3 },
                { step: '3', title: 'Test', desc: 'Quality tests by certified labs', icon: Shield },
                { step: '4', title: 'Batch', desc: 'Create and mint final batch', icon: QrCode },
                { step: '5', title: 'Trace', desc: 'Consumer scans QR code', icon: Smartphone }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p>Built with Next.js, NestJS, Prisma, and TypeScript</p>
          <p className="text-sm mt-2">Ready for Hyperledger Fabric integration</p>
        </div>
      </div>
    </div>
  )
}