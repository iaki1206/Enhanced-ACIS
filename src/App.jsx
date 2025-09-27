import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx'
import { 
  Shield, 
  Brain, 
  Zap, 
  Network, 
  Eye, 
  Target, 
  Gamepad2, 
  TrendingUp,
  Globe,
  Cpu,
  Lock,
  Activity,
  AlertTriangle,
  CheckCircle,
  Users,
  Database,
  Settings,
  BarChart3,
  Radar,
  Atom,
  GitBranch,
  Layers,
  Sparkles,
  ArrowRight,
  Play,
  Download,
  ExternalLink,
  Menu,
  X,
  FileText,
  Code,
  Package,
  Terminal,
  BookOpen,
  Wrench
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './App.css'

// Mock data for demonstrations
const threatData = [
  { time: '00:00', threats: 12, blocked: 11, severity: 2.1 },
  { time: '04:00', threats: 8, blocked: 8, severity: 1.8 },
  { time: '08:00', threats: 25, blocked: 23, severity: 3.2 },
  { time: '12:00', threats: 18, blocked: 17, severity: 2.7 },
  { time: '16:00', threats: 32, blocked: 30, severity: 4.1 },
  { time: '20:00', threats: 15, blocked: 14, severity: 2.3 }
]

const protocolData = [
  { name: 'Modbus TCP', port: 502, status: 'Active', threats: 5 },
  { name: 'OPC UA', port: 4840, status: 'Active', threats: 3 },
  { name: 'DNP3', port: 20000, status: 'Active', threats: 2 },
  { name: 'EtherNet/IP', port: 44818, status: 'Active', threats: 1 },
  { name: 'IEC 61850', port: 102, status: 'Active', threats: 4 },
  { name: 'BACnet', port: 47808, status: 'Active', threats: 0 },
  { name: 'PROFINET', port: 34964, status: 'Active', threats: 1 }
]

const systemMetrics = {
  eventsProcessed: 125847,
  threatsDetected: 342,
  accuracyRate: 99.7,
  uptime: 99.9,
  quantumSecurity: 'Active',
  swarmAgents: 12,
  digitalTwins: 5,
  immunityLevel: 94.2
}

// Download Registration Gate (modal)
function DownloadGate({ isOpen, fileUrl, onClose }) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState("")
  const [enteredCode, setEnteredCode] = useState("")

  useEffect(() => {
    if (isOpen) {
      // reset form when opened
      setFirstName("")
      setLastName("")
      setEmail("")
      setErrors({})
      setStep(1)
      setVerificationCode("")
      setEnteredCode("")
    }
  }, [isOpen])

  const validateEmail = (value) => {
    // Basic RFC 5322-like email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(value).toLowerCase())
  }

  const startVerification = () => {
    const currentErrors = {}
    if (!firstName.trim()) currentErrors.firstName = 'First name is required'
    if (!lastName.trim()) currentErrors.lastName = 'Last name is required'
    if (!email.trim()) currentErrors.email = 'Email is required'
    else if (!validateEmail(email)) currentErrors.email = 'Enter a valid email address'

    setErrors(currentErrors)
    if (Object.keys(currentErrors).length === 0) {
      const code = String(Math.floor(100000 + Math.random() * 900000))
      setVerificationCode(code)
      setStep(2)
    }
  }

  const completeVerification = () => {
    const currentErrors = {}
    if (enteredCode.trim() !== verificationCode) {
      currentErrors.enteredCode = 'Invalid verification code'
    }
    setErrors(currentErrors)
    if (Object.keys(currentErrors).length === 0) {
      // Send registration to server to save TXT at project root
      const payload = {
        firstName,
        lastName,
        email,
        fileUrl,
        timestamp: new Date().toISOString()
      }
      fetch('/api/save-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {/* non-blocking */})

      // Trigger actual file download (robust with fallback)
      const url = fileUrl || '/downloads/ACIS_Enhanced_Windows_v1.0.0_Secure.zip'
      try {
        const dl = document.createElement('a')
        dl.href = url
        dl.setAttribute('download', '')
        dl.style.display = 'none'
        document.body.appendChild(dl)
        dl.click()
        document.body.removeChild(dl)
      } catch (_) {}

      // Fallback in case the programmatic click is blocked
      setTimeout(() => {
        try {
          window.open(url, '_blank')
        } catch (_) {}
      }, 100)

      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Download Registration</CardTitle>
          <CardDescription>
            Please provide your details to continue. Email verification is required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={startVerification}>Continue</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Alert>
                <AlertTitle>Email Verification</AlertTitle>
                <AlertDescription>
                  A 6-digit verification code has been sent to <strong>{email}</strong>.
                  For demo purposes, the code is displayed below.
                </AlertDescription>
              </Alert>
              <div className="p-3 bg-gray-100 rounded-md font-mono text-center text-lg tracking-widest">
                {verificationCode}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Enter Verification Code</label>
                <input
                  type="text"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  placeholder="e.g., 123456"
                />
                {errors.enteredCode && (
                  <p className="text-red-600 text-sm mt-1">{errors.enteredCode}</p>
                )}
              </div>
              <div className="flex justify-between gap-2">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={onClose}>Cancel</Button>
                  <Button onClick={completeVerification}>Verify & Download</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Navigation Component
function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Home', icon: Shield },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/features', label: 'Features', icon: Sparkles },
    { path: '/demo', label: 'Live Demo', icon: Play },
    { path: '/docs', label: 'Documentation', icon: BookOpen },
    { path: '/downloads', label: 'Downloads', icon: Download }
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Enhanced ACIS</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === item.path
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Home Page Component
function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Enhanced ACIS
              <span className="block text-2xl md:text-3xl text-blue-300 mt-2">
                Adaptive Cybernetic Immune System
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-4xl mx-auto">
              Revolutionary cybersecurity platform combining biological immune system principles 
              with quantum security, AI, swarm intelligence, and digital twins for critical infrastructure protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demo">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                  <Play className="mr-2 h-5 w-5" />
                  Live Demo
                </Button>
              </Link>
              <Link to="/downloads">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
                  <Download className="mr-2 h-5 w-5" />
                  Download
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Revolutionary Cybersecurity Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              18 advanced modules working together to provide unprecedented protection for critical infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "🧬 Cyber Stem Cells",
                description: "Self-healing architecture with automatic infection isolation and system regeneration from clean cellular backups",
                color: "text-purple-600"
              },
              {
                icon: Atom,
                title: "⚛️ Quantum Security",
                description: "Post-quantum cryptography and quantum key distribution for future-proof security against quantum computers",
                color: "text-blue-600"
              },
              {
                icon: Network,
                title: "🕸️ Swarm Intelligence",
                description: "Distributed decision making with 12 coordinated agents for collective threat assessment and response",
                color: "text-green-600"
              },
              {
                icon: Layers,
                title: "🏭 Digital Twin Security",
                description: "Safe attack simulation on digital replicas of industrial processes with real-time synchronization",
                color: "text-orange-600"
              },
              {
                icon: Shield,
                title: "🤖 Adaptive Immune Response",
                description: "Auto-vaccination system that learns from attacks and builds digital immunity with memory B-cells",
                color: "text-red-600"
              },
              {
                icon: Target,
                title: "🔌 OT/ICS Protocol Support",
                description: "Native support for 7 critical industrial protocols including Modbus, OPC UA, DNP3, EtherNet/IP",
                color: "text-indigo-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* System Metrics */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real-Time System Performance
            </h2>
            <p className="text-xl text-gray-600">
              Live metrics from Enhanced ACIS deployment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Events Processed", value: systemMetrics.eventsProcessed.toLocaleString(), icon: Activity, color: "text-blue-600" },
              { label: "Threats Detected", value: systemMetrics.threatsDetected.toLocaleString(), icon: AlertTriangle, color: "text-red-600" },
              { label: "Accuracy Rate", value: `${systemMetrics.accuracyRate}%`, icon: Target, color: "text-green-600" },
              { label: "System Uptime", value: `${systemMetrics.uptime}%`, icon: CheckCircle, color: "text-purple-600" }
            ].map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                    <metric.icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Secure Your Critical Infrastructure?
          </h2>
          <p className="text-xl mb-8 text-blue-200 max-w-3xl mx-auto">
            Join the future of cybersecurity with Enhanced ACIS's revolutionary approach to threat detection and response.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                View Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
                <ExternalLink className="mr-2 h-5 w-5" />
                Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Documentation Page Component
function DocumentationPage() {
  const [gateOpen, setGateOpen] = useState(false)
  const [selectedFileUrl, setSelectedFileUrl] = useState(null)
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Documentation</h1>
          <p className="text-gray-600 mt-2">Comprehensive guides and technical documentation for Enhanced ACIS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: BookOpen,
              title: "📚 User Manual",
              description: "Complete guide for using Enhanced ACIS platform",
              sections: ["Getting Started", "Dashboard Overview", "Configuration", "Monitoring", "Troubleshooting"],
              downloadLink: "/downloads/User_Manual.pdf"
            },
            {
              icon: Code,
              title: "🔧 Technical Documentation",
              description: "Detailed technical specifications and architecture",
              sections: ["System Architecture", "API Reference", "Database Schema", "Security Protocols", "Performance Tuning"],
              downloadLink: "/downloads/Technical_Documentation.pdf"
            },
            {
              icon: Package,
              title: "🚀 Installation Guide",
              description: "Step-by-step installation and deployment instructions",
              sections: ["System Requirements", "Installation Steps", "Configuration", "Docker Deployment", "Kubernetes Setup"],
              downloadLink: "/downloads/Installation_Guide.pdf"
            },
            {
              icon: Brain,
              title: "🧬 Biological Features Guide",
              description: "Understanding the bio-inspired security mechanisms",
              sections: ["Adaptive Immune Response", "Cyber Stem Cells", "Digital DNA Sequencing", "Auto-vaccination", "Memory B-Cells"],
              downloadLink: "/downloads/Biological_Features_Guide.pdf"
            },
            {
              icon: Atom,
              title: "🤖 AI & ML Documentation",
              description: "Artificial Intelligence and Machine Learning components",
              sections: ["Predictive Intelligence", "Explainable AI", "Confidence Scoring", "Time Series Forecasting", "Geopolitical Analysis"],
              downloadLink: "/downloads/AI_ML_Documentation.pdf"
            },
            {
              icon: Lock,
              title: "⚛️ Quantum Security Guide",
              description: "Quantum-enhanced security features and protocols",
              sections: ["Post-Quantum Cryptography", "Quantum Key Distribution", "Zero-Knowledge Protocols", "Quantum-Safe Algorithms", "Implementation"],
              downloadLink: "/downloads/Quantum_Security_Guide.pdf"
            }
          ].map((doc, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <doc.icon className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">{doc.title}</CardTitle>
                <CardDescription>{doc.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {doc.sections.map((section, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {section}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  onClick={() => {
                    setSelectedFileUrl(doc.downloadLink)
                    setGateOpen(true)
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Documentation Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">API Documentation</CardTitle>
              <CardDescription>Complete API reference for Enhanced ACIS integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Core Endpoints</h3>
                  <div className="space-y-4">
                    {[
                      { method: "GET", endpoint: "/api/v1/status", description: "System status and health" },
                      { method: "POST", endpoint: "/api/v1/threats/analyze", description: "Analyze threat data" },
                      { method: "GET", endpoint: "/api/v1/protocols", description: "List supported protocols" },
                      { method: "POST", endpoint: "/api/v1/agents/deploy", description: "Deploy ECO agents" },
                      { method: "GET", endpoint: "/api/v1/predictions", description: "Get threat predictions" }
                    ].map((api, idx) => (
                      <div key={idx} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <Badge variant={api.method === 'GET' ? 'secondary' : 'default'}>
                          {api.method}
                        </Badge>
                        <code className="text-sm font-mono text-gray-700">{api.endpoint}</code>
                        <span className="text-sm text-gray-600">{api.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Advanced Features</h3>
                  <div className="space-y-4">
                    {[
                      { method: "POST", endpoint: "/api/v1/stem-cells/regenerate", description: "Trigger system regeneration" },
                      { method: "GET", endpoint: "/api/v1/quantum/status", description: "Quantum security status" },
                      { method: "POST", endpoint: "/api/v1/swarm/consensus", description: "Initiate swarm consensus" },
                      { method: "GET", endpoint: "/api/v1/digital-twin/sync", description: "Digital twin synchronization" },
                      { method: "POST", endpoint: "/api/v1/immune/vaccinate", description: "Deploy auto-vaccination" }
                    ].map((api, idx) => (
                      <div key={idx} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <Badge variant={api.method === 'GET' ? 'secondary' : 'default'}>
                          {api.method}
                        </Badge>
                        <code className="text-sm font-mono text-gray-700">{api.endpoint}</code>
                        <span className="text-sm text-gray-600">{api.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <DownloadGate
        isOpen={gateOpen}
        fileUrl={selectedFileUrl}
        onClose={() => setGateOpen(false)}
      />
    </div>
  )
}

// Downloads Page Component
function DownloadsPage() {
  const [gateOpen, setGateOpen] = useState(false)
  const [selectedFileUrl, setSelectedFileUrl] = useState(null)
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Downloads & Installation</h1>
          <p className="text-gray-600 mt-2">Get Enhanced ACIS deployed in minutes with our one-click installation</p>
        </div>

        {/* One-Click Installation */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">🚀 One-Click Installation</h2>
              <p className="text-xl mb-6">Deploy Enhanced ACIS instantly with our automated installer</p>
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Terminal className="mr-2 h-5 w-5" />
                Install Now (Linux/Docker)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Download Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Package,
              title: "🪟 Windows Package",
              description: "Complete Windows executable with GUI installer",
              size: "Demo",
              version: "v1.0.0",
              requirements: "Windows 10/11, 4GB RAM, 2GB Storage",
              features: ["GUI Installer", "Windows Service", "Desktop Shortcuts"],
              downloadLink: "https://github.com/iaki1206/Enhanced-ACIS/releases/download/v1.0.0/ACIS_Enhanced_Windows_v1.0.0_Secure.zip"
            },
            {
              icon: Code,
              title: "💻 IDE Development Package",
              description: "Source code package for development environments",
              size: "Demo",
              version: "v1.0.0",
              requirements: "Python 3.8+, Node.js 16+, Docker",
              features: ["Complete Source", "Development Tools", "Debug Mode", "Hot Reload"],
              downloadLink: "https://github.com/iaki1206/Enhanced-ACIS/releases/download/v1.0.0/SICA_Enhanced_IDE_v1.0.0_Secure.zip"
            },
            {
              icon: Terminal,
              title: "🐧 Linux Package",
              description: "Native Linux package with systemd integration",
              size: "156 MB",
              version: "v2.1.0",
              requirements: "Ubuntu 20.04+, Debian 11+, CentOS 8+",
              features: ["Systemd Service", "Package Manager", "Auto-Updates", "CLI Tools"],
              downloadLink: "https://github.com/iaki1206/Enhanced-ACIS/releases/download/v1.0.0/ACIS_Enhanced_Linux_v1.0.0_Secure.zip"
            }
          ].map((pkg, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <pkg.icon className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">{pkg.title}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-semibold">{pkg.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Version:</span>
                    <span className="font-semibold">{pkg.version}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <strong>Requirements:</strong> {pkg.requirements}
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  onClick={() => {
                    setSelectedFileUrl(pkg.downloadLink)
                    setGateOpen(true)
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Package
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Installation Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Installation Instructions</CardTitle>
            <CardDescription>Quick setup guides for different deployment scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">🚀 Quick Start (Docker)</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div># Download and run Enhanced ACIS</div>
                  <div>curl -sSL https://get.enhanced-sica.com | bash</div>
                  <div>docker-compose up -d</div>
                  <div># Access dashboard at http://localhost:3000</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">💻 Development Setup</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div># Clone and setup development environment</div>
                  <div>git clone https://github.com/enhanced-sica/core.git</div>
                  <div>cd enhanced-sica && ./scripts/dev-setup.sh</div>
                  <div>python src/cli/ultimate_sica_cli.py demo</div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">📋 System Requirements</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Minimum</h4>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• 4GB RAM</li>
                    <li>• 2GB Storage</li>
                    <li>• 2 CPU Cores</li>
                    <li>• Network Access</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Recommended</h4>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• 16GB RAM</li>
                    <li>• 50GB SSD</li>
                    <li>• 8 CPU Cores</li>
                    <li>• Dedicated Network</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Production</h4>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• 64GB RAM</li>
                    <li>• 500GB NVMe</li>
                    <li>• 32 CPU Cores</li>
                    <li>• Redundant Network</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <DownloadGate
        isOpen={gateOpen}
        fileUrl={selectedFileUrl}
        onClose={() => setGateOpen(false)}
      />
    </div>
  )
}

// Dashboard Component
function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Enhanced ACIS Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time cybersecurity monitoring and control center</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="threats">Threats</TabsTrigger>
            <TabsTrigger value="protocols">Protocols</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System State</CardTitle>
                  <Shield className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">HEALTHY</div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">MEDIUM</div>
                  <p className="text-xs text-muted-foreground">3 active threats</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quantum Security</CardTitle>
                  <Atom className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">ACTIVE</div>
                  <p className="text-xs text-muted-foreground">Post-quantum ready</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Immunity Level</CardTitle>
                  <Activity className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{systemMetrics.immunityLevel}%</div>
                  <p className="text-xs text-muted-foreground">Digital immunity active</p>
                </CardContent>
              </Card>
            </div>

            {/* Threat Timeline Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Threat Detection Timeline</CardTitle>
                <CardDescription>Real-time threat detection and blocking activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={threatData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} name="Threats Detected" />
                    <Line type="monotone" dataKey="blocked" stroke="#10b981" strokeWidth={2} name="Threats Blocked" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Threats</CardTitle>
                <CardDescription>Current security threats and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 1, type: "Modbus TCP Anomaly", severity: "High", status: "Blocked", time: "2 min ago" },
                    { id: 2, type: "OPC UA Unauthorized Access", severity: "Critical", status: "Quarantined", time: "5 min ago" },
                    { id: 3, type: "DNP3 Protocol Violation", severity: "Medium", status: "Monitoring", time: "8 min ago" }
                  ].map((threat) => (
                    <div key={threat.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{threat.type}</h4>
                        <p className="text-sm text-gray-600">{threat.time}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={threat.severity === 'Critical' ? 'destructive' : threat.severity === 'High' ? 'default' : 'secondary'}>
                          {threat.severity}
                        </Badge>
                        <Badge variant="outline">{threat.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="protocols" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>OT/ICS Protocol Monitoring</CardTitle>
                <CardDescription>Status of supported industrial protocols</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {protocolData.map((protocol, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{protocol.name}</h4>
                        <p className="text-sm text-gray-600">Port: {protocol.port}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm">Threats: {protocol.threats}</span>
                        <Badge variant={protocol.status === 'Active' ? 'default' : 'secondary'}>
                          {protocol.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ECO Agent Swarm</CardTitle>
                <CardDescription>Status and missions of deployed security agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "ECO-Alpha", status: "Active", mission: "Network Reconnaissance", progress: 85 },
                    { name: "ECO-Beta", status: "Active", mission: "Vulnerability Assessment", progress: 62 },
                    { name: "ECO-Gamma", status: "Standby", mission: "Threat Hunting", progress: 0 },
                    { name: "ECO-Delta", status: "Active", mission: "Protocol Analysis", progress: 94 }
                  ].map((agent, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{agent.name}</h4>
                        <Badge variant={agent.status === 'Active' ? 'default' : 'secondary'}>
                          {agent.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{agent.mission}</p>
                      <Progress value={agent.progress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{agent.progress}% complete</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Analytics</CardTitle>
                <CardDescription>Advanced analytics and business intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { category: 'Critical Infrastructure', risk: 15, impact: 95 },
                    { category: 'Network Security', risk: 8, impact: 70 },
                    { category: 'Data Protection', risk: 12, impact: 85 },
                    { category: 'Compliance', risk: 5, impact: 60 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="risk" fill="#ef4444" name="Risk Level" />
                    <Bar dataKey="impact" fill="#3b82f6" name="Business Impact" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Features Page Component
function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Enhanced ACIS Features</h1>
          <p className="text-gray-600 mt-2">Comprehensive overview of all advanced cybersecurity capabilities</p>
        </div>

        <div className="space-y-12">
          {[
            {
              category: "🧬 Biological-Inspired Security",
              icon: Brain,
              features: [
                {
                  name: "Cyber Stem Cells",
                  description: "Revolutionary self-healing architecture with automatic infection isolation and system regeneration",
                  specs: ["8 specialized cell types", "Auto-regeneration protocols", "Quarantine mechanisms", "Backup cell banks"]
                },
                {
                  name: "Adaptive Immune Response",
                  description: "Bio-inspired immune system with auto-vaccination and digital DNA sequencing",
                  specs: ["Auto-vaccination system", "Digital DNA analysis", "Memory B-cells", "Herd immunity tracking"]
                },
                {
                  name: "Pathogen Analysis",
                  description: "Advanced malware genetics analysis with phylogenetic tree construction",
                  specs: ["Genetic fingerprinting", "Mutation detection", "Family classification", "Evolution tracking"]
                }
              ]
            },
            {
              category: "🤖 Advanced Artificial Intelligence",
              icon: Brain,
              features: [
                {
                  name: "Predictive Intelligence 2.0",
                  description: "Next-generation threat prediction with 72-hour forecasting capability",
                  specs: ["LSTM neural networks", "Ensemble modeling", "Geopolitical correlation", "Time series analysis"]
                },
                {
                  name: "Explainable AI (XAI)",
                  description: "Transparent decision-making with confidence scoring and decision trees",
                  specs: ["Decision transparency", "Confidence metrics", "Feature importance", "Bias detection"]
                },
                {
                  name: "Behavioral Analytics",
                  description: "Advanced behavioral baseline learning and anomaly detection",
                  specs: ["Baseline establishment", "Deviation analysis", "Pattern recognition", "Adaptive thresholds"]
                }
              ]
            },
            {
              category: "⚛️ Quantum-Enhanced Security",
              icon: Atom,
              features: [
                {
                  name: "Post-Quantum Cryptography",
                  description: "Future-proof encryption resistant to quantum computer attacks",
                  specs: ["CRYSTALS-Kyber", "CRYSTALS-Dilithium", "FALCON signatures", "SPHINCS+ hashing"]
                },
                {
                  name: "Quantum Key Distribution",
                  description: "Information-theoretically secure key exchange using quantum mechanics",
                  specs: ["BB84 protocol", "Quantum entanglement", "Eavesdropping detection", "Perfect forward secrecy"]
                },
                {
                  name: "Zero-Knowledge Security",
                  description: "Privacy-preserving authentication and threat intelligence sharing",
                  specs: ["ZK-SNARKs", "ZK-STARKs", "Bulletproofs", "Secure multi-party computation"]
                }
              ]
            }
          ].map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <category.icon className="h-8 w-8 text-blue-600 mr-3" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {category.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">{feature.name}</h3>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.specs.map((spec, specIndex) => (
                          <li key={specIndex} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Demo Page Component
function DemoPage() {
  const [selectedDemo, setSelectedDemo] = useState("threat-detection")

  const demoScenarios = [
    { id: 'threat-detection', name: 'Threat Detection', icon: Shield },
    { id: 'ai-analysis', name: 'AI Analysis', icon: Brain },
    { id: 'quantum-security', name: 'Quantum Security', icon: Atom },
    { id: 'swarm-intelligence', name: 'Swarm Intelligence', icon: Network },
    { id: 'digital-twin', name: 'Digital Twin', icon: Layers }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Live Demo</h1>
          <p className="text-gray-600 mt-2">Interactive demonstrations of Enhanced ACIS capabilities</p>
        </div>

        {/* Demo Scenario Selector */}
        <div className="mb-8">
          <Tabs value={selectedDemo} onValueChange={setSelectedDemo}>
            <TabsList className="grid w-full grid-cols-5">
              {demoScenarios.map((scenario) => {
                const Icon = scenario.icon
                return (
                  <TabsTrigger key={scenario.id} value={scenario.id} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{scenario.name}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <TabsContent value="threat-detection" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-6 w-6 text-blue-600 mr-2" />
                    Real-Time Threat Detection Demo
                  </CardTitle>
                  <CardDescription>Live demonstration of Enhanced ACIS's threat detection capabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Live Threat Feed</h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {[
                          { time: "14:23:45", threat: "Modbus TCP anomaly detected", severity: "High", status: "Blocked" },
                          { time: "14:22:12", threat: "Suspicious OPC UA traffic", severity: "Medium", status: "Monitoring" },
                          { time: "14:21:33", threat: "DNP3 protocol violation", severity: "Low", status: "Logged" },
                          { time: "14:20:58", threat: "EtherNet/IP scan attempt", severity: "High", status: "Blocked" },
                          { time: "14:19:45", threat: "IEC 61850 unauthorized access", severity: "Critical", status: "Quarantined" }
                        ].map((threat, index) => (
                          <Alert key={index}>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle className="text-sm">{threat.time} - {threat.threat}</AlertTitle>
                            <AlertDescription className="flex justify-between items-center">
                              <span>Status: {threat.status}</span>
                              <Badge variant={threat.severity === 'Critical' ? 'destructive' : 'default'}>
                                {threat.severity}
                              </Badge>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Detection Metrics</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={threatData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="threats" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                          <Area type="monotone" dataKey="blocked" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-analysis" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-6 w-6 text-purple-600 mr-2" />
                    AI-Powered Threat Analysis Demo
                  </CardTitle>
                  <CardDescription>Advanced AI analysis with predictive capabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Predictive Analysis</h3>
                      <div className="space-y-4">
                        {[
                          { prediction: "Advanced Persistent Threat (APT) campaign likely in next 24h", confidence: 87, timeframe: "24 hours" },
                          { prediction: "Ransomware attack targeting OT networks predicted", confidence: 73, timeframe: "48 hours" },
                          { prediction: "Supply chain compromise attempt expected", confidence: 65, timeframe: "72 hours" }
                        ].map((pred, index) => (
                          <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="font-semibold text-gray-800 mb-2">{pred.prediction}</div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Timeframe: {pred.timeframe}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Confidence:</span>
                                <Progress value={pred.confidence} className="w-20 h-2" />
                                <span className="text-sm font-semibold text-blue-600">{pred.confidence}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Explainable AI Decision Tree</h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-center mb-4">
                          <Badge variant="destructive" className="text-lg px-4 py-2">
                            THREAT DETECTED
                          </Badge>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>Unusual network traffic pattern detected (Weight: 0.35)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span>Protocol anomaly in Modbus TCP (Weight: 0.28)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span>Geopolitical risk factor elevated (Weight: 0.22)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Historical attack pattern match (Weight: 0.15)</span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-100 rounded text-center">
                          <span className="font-semibold text-blue-800">Final Confidence Score: 94.7%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quantum-security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Atom className="h-6 w-6 text-green-600 mr-2" />
                    Quantum Security Demo
                  </CardTitle>
                  <CardDescription>Advanced quantum cryptography and post-quantum security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Quantum Key Distribution</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Quantum Channel Status</span>
                            <Badge variant="default" className="bg-green-600">Active</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>Entanglement Rate: 1.2M qubits/sec</div>
                            <div>Error Rate: 0.003%</div>
                            <div>Key Generation: 256-bit keys every 0.5ms</div>
                          </div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="font-semibold mb-2">Post-Quantum Algorithms</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>CRYSTALS-Kyber</span>
                              <Badge variant="outline">Active</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>CRYSTALS-Dilithium</span>
                              <Badge variant="outline">Active</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>FALCON</span>
                              <Badge variant="outline">Standby</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Quantum Threat Assessment</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Quantum-Safe', value: 85, fill: '#10b981' },
                              { name: 'Vulnerable', value: 12, fill: '#f59e0b' },
                              { name: 'Critical Risk', value: 3, fill: '#ef4444' }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="swarm-intelligence" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Network className="h-6 w-6 text-orange-600 mr-2" />
                    Swarm Intelligence Demo
                  </CardTitle>
                  <CardDescription>Distributed AI agents working in coordination</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Active Agent Swarm</h3>
                      <div className="space-y-3">
                        {[
                          { id: "ECO-Alpha", task: "Network Scanning", progress: 87, status: "Active", location: "DMZ-01" },
                          { id: "ECO-Beta", task: "Vulnerability Assessment", progress: 64, status: "Active", location: "SCADA-Network" },
                          { id: "ECO-Gamma", task: "Threat Hunting", progress: 92, status: "Active", location: "OT-Zone-A" },
                          { id: "ECO-Delta", task: "Protocol Analysis", progress: 45, status: "Active", location: "HMI-Segment" },
                          { id: "ECO-Epsilon", task: "Anomaly Detection", progress: 78, status: "Active", location: "Control-Room" }
                        ].map((agent, index) => (
                          <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-semibold text-orange-800">{agent.id}</div>
                              <Badge variant="default" className="bg-orange-600">{agent.status}</Badge>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              <div>Task: {agent.task}</div>
                              <div>Location: {agent.location}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Progress value={agent.progress} className="flex-1 h-2" />
                              <span className="text-sm font-semibold text-orange-600">{agent.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Swarm Coordination Matrix</h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-5 gap-2 mb-4">
                          {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'].map((agent, i) => (
                            <div key={i} className="text-center text-xs font-semibold p-2 bg-white rounded">
                              {agent}
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          {[
                            [1, 0.8, 0.6, 0.4, 0.7],
                            [0.8, 1, 0.9, 0.5, 0.6],
                            [0.6, 0.9, 1, 0.7, 0.8],
                            [0.4, 0.5, 0.7, 1, 0.9],
                            [0.7, 0.6, 0.8, 0.9, 1]
                          ].map((row, i) => (
                            <div key={i} className="grid grid-cols-5 gap-2">
                              {row.map((value, j) => (
                                <div
                                  key={j}
                                  className={`text-center text-xs p-2 rounded ${
                                    value === 1 ? 'bg-green-200' :
                                    value >= 0.8 ? 'bg-green-100' :
                                    value >= 0.6 ? 'bg-yellow-100' :
                                    'bg-red-100'
                                  }`}
                                >
                                  {value.toFixed(1)}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <Badge variant="default" className="bg-green-600">
                            Swarm Coherence: 94.2%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="digital-twin" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Layers className="h-6 w-6 text-purple-600 mr-2" />
                    Digital Twin Demo
                  </CardTitle>
                  <CardDescription>Virtual replicas of critical infrastructure systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Active Digital Twins</h3>
                      <div className="space-y-4">
                        {[
                          { 
                            name: "Power Grid Twin", 
                            sync: 99.8, 
                            status: "Synchronized", 
                            lastUpdate: "0.2s ago",
                            components: 1247,
                            alerts: 0
                          },
                          { 
                            name: "Water Treatment Twin", 
                            sync: 97.5, 
                            status: "Synchronized", 
                            lastUpdate: "0.5s ago",
                            components: 892,
                            alerts: 2
                          },
                          { 
                            name: "Manufacturing Twin", 
                            sync: 98.9, 
                            status: "Synchronized", 
                            lastUpdate: "0.1s ago",
                            components: 2156,
                            alerts: 1
                          },
                          { 
                            name: "Transportation Twin", 
                            sync: 96.2, 
                            status: "Partial Sync", 
                            lastUpdate: "1.2s ago",
                            components: 1834,
                            alerts: 3
                          }
                        ].map((twin, index) => (
                          <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-semibold text-purple-800">{twin.name}</div>
                              <Badge variant={twin.status === 'Synchronized' ? 'default' : 'secondary'}>
                                {twin.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                              <div>Sync Rate: {twin.sync}%</div>
                              <div>Components: {twin.components}</div>
                              <div>Last Update: {twin.lastUpdate}</div>
                              <div>Alerts: {twin.alerts}</div>
                            </div>
                            <Progress value={twin.sync} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Twin Performance Metrics</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={[
                          { time: '00:00', accuracy: 98.5, latency: 12, throughput: 1250 },
                          { time: '04:00', accuracy: 97.8, latency: 15, throughput: 1180 },
                          { time: '08:00', accuracy: 99.2, latency: 8, throughput: 1340 },
                          { time: '12:00', accuracy: 98.9, latency: 10, throughput: 1290 },
                          { time: '16:00', accuracy: 99.5, latency: 6, throughput: 1420 },
                          { time: '20:00', accuracy: 98.7, latency: 11, throughput: 1310 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="accuracy" stroke="#8b5cf6" name="Accuracy %" />
                          <Line type="monotone" dataKey="throughput" stroke="#06b6d4" name="Throughput" />
                        </LineChart>
                      </ResponsiveContainer>
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center mb-2">
                          <Badge variant="default" className="bg-purple-600">
                            Digital Twin Network Status: Optimal
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-center">
                          <div>
                            <div className="font-semibold text-purple-600">98.8%</div>
                            <div className="text-gray-600">Avg Accuracy</div>
                          </div>
                          <div>
                            <div className="font-semibold text-purple-600">10.3ms</div>
                            <div className="text-gray-600">Avg Latency</div>
                          </div>
                          <div>
                            <div className="font-semibold text-purple-600">1,298</div>
                            <div className="text-gray-600">Avg Throughput</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
        </Routes>
        
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-8 w-8 text-blue-400" />
                  <span className="text-xl font-bold">Enhanced ACIS</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Revolutionary cybersecurity platform with biological-inspired adaptive intelligence for critical infrastructure protection.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Features</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Cyber Stem Cells</li>
                  <li>Quantum Security</li>
                  <li>Swarm Intelligence</li>
                  <li>Digital Twin Security</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/docs" className="hover:text-white">Documentation</Link></li>
                  <li>API Reference</li>
                  <li>Installation Guide</li>
                  <li>Support</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Download</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/downloads" className="hover:text-white">Windows Package</Link></li>
                  <li><Link to="/downloads" className="hover:text-white">Linux Package</Link></li>
                  <li><Link to="/downloads" className="hover:text-white">IDE Development</Link></li>
                  <li><Link to="/downloads" className="hover:text-white">Source Code</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Enhanced ACIS. Advanced Cybersecurity Platform for Critical Infrastructure.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
