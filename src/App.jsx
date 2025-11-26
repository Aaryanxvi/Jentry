import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Plus, FileText, BarChart3, Calendar, User, CheckCircle, AlertCircle, Clock, Eye, Edit, MoreVertical, X, Upload, ChevronLeft, ChevronRight, MessageSquare, Menu, Share2, MoreHorizontal, RefreshCw, Copy, Filter, List, Grid } from 'lucide-react';

// Mock data
const mockAudits = [
  {
    id: 'AUD-2023-001',
    name: 'Annual Farm Safety Assessment',
    client: 'Green Valley Farms',
    clientType: 'Agricultural',
    status: 'Completed',
    lastModified: 'Oct 15, 2023',
    time: '10:35 AM',
    compliance: 92,
    requirements: '48/52 requirements met',
    assignedTo: ['JD', 'ABC'],
    icon: '📄',
    color: 'green'
  },
  {
    id: 'AUD-2023-045',
    name: 'Pesticide Usage Compliance',
    client: 'Sunshine Orchards',
    clientType: 'Fruit Production',
    status: 'In Progress',
    lastModified: 'Nov 2, 2023',
    time: '2:15 PM',
    compliance: 67,
    requirements: '22/33 requirements met',
    assignedTo: ['AJ', 'ABC'],
    icon: '📄',
    color: 'yellow'
  },
  {
    id: 'AUD-2023-078',
    name: 'Water Management Audit',
    client: 'Blue River Vineyards',
    clientType: 'Viticulture',
    status: 'Pending Review',
    lastModified: 'Oct 28, 2023',
    time: '9:45 AM',
    compliance: 84,
    requirements: '42/50 requirements met',
    assignedTo: ['MB', 'ABC'],
    icon: '📄',
    color: 'blue'
  },
  {
    id: 'AUD-2023-103',
    name: 'Organic Certification Assessment',
    client: 'Natural Harvest Co-op',
    clientType: 'Organic Farming',
    status: 'Needs Attention',
    lastModified: 'Nov 5, 2023',
    time: '11:20 AM',
    compliance: 45,
    requirements: '18/40 requirements met',
    assignedTo: ['SW', 'ABC'],
    icon: '📄',
    color: 'red'
  }
];

const mockChats = [
  {
    id: 1,
    name: 'Chat 1',
    message: "Why was 'missing evidence' flagged for the soil health report?",
    response: "The AI flagged the soil health report as 'missing evidence' because the document was mentioned in the main audit report summary but was not found in the uploaded file folder. Please follow up with the farm operator to obtain this document."
  },
  {
    id: 2,
    name: 'Chat 2',
    message: 'What are the key findings from the pesticide compliance audit?'
  },
  {
    id: 3,
    name: 'Chat 3',
    message: 'Generate a summary report for Green Valley Farms'
  }
];

const mockDocuments = [
  { name: 'Financial Report Q2', type: 'Financial', uploader: 'David Lee', date: '2024-07-20', status: 'Approved' },
  { name: 'Compliance Audit', type: 'Compliance', uploader: 'Emily Chen', date: '2024-07-18', status: 'Pending' },
  { name: 'Legal Agreement', type: 'Legal', uploader: 'Michael Wong', date: '2024-07-15', status: 'Approved' },
  { name: 'HR Policy Update', type: 'HR', uploader: 'Jessica Tan', date: '2024-07-12', status: 'Rejected' },
  { name: 'Marketing Plan', type: 'Marketing', uploader: 'Daniel Lim', date: '2024-07-09', status: 'Approved' }
];

const JentryPlatform = () => {
  const [currentView, setCurrentView] = useState('login');
  const [audits, setAudits] = useState(mockAudits);
  const [activeAudit, setActiveAudit] = useState(mockAudits[0] || null);
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [chatInput, setChatInput] = useState('');
  const [showNewAudit, setShowNewAudit] = useState(false);
  const [auditStep, setAuditStep] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState('name');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [auditModalMode, setAuditModalMode] = useState('view'); // 'view' | 'edit'
  
  // New Audit form state
  const [auditForm, setAuditForm] = useState({
    title: '',
    operator: '',
    location: '',
    date: '',
    standard: '',
    participants: [
      { name: 'Ethan Carter', role: 'Field Auditor' },
      { name: 'Olivia Bennett', role: 'Senior Reviewer' },
      { name: 'Noah Thompson', role: 'Farm Manager' }
    ]
  });

  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'Audit Report 2023.pdf', status: 'complete' },
    { name: 'Operator Documents.zip', status: 'complete' }
  ]);
  const fileInputRef = useRef(null);

  const filteredSortedAudits = useMemo(() => {
    let items = [...audits];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      items = items.filter(a => a.name.toLowerCase().includes(q) || a.client.toLowerCase().includes(q) || a.id.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') {
      items = items.filter(a => a.status === statusFilter);
    }
    items.sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      if (sortKey === 'client') return a.client.localeCompare(b.client);
      if (sortKey === 'compliance') return b.compliance - a.compliance;
      return 0;
    });
    return items;
  }, [searchTerm, statusFilter, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredSortedAudits.length / pageSize));
  const pagedAudits = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSortedAudits.slice(start, start + pageSize);
  }, [filteredSortedAudits, page]);

  const handleViewAudit = (audit) => {
    setActiveAudit(audit);
    setSelectedAudit(null);
    setAuditModalMode('view');
    setCurrentView('simulation');
  };

  // Sidebar Component
  const Sidebar = () => (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300`}>
      <div className="p-6 border-b border-gray-200">
        <h1 className={`text-2xl font-bold ${sidebarCollapsed ? 'hidden' : 'block'}`}>Jentry</h1>
        {sidebarCollapsed && <h1 className="text-2xl font-bold">J</h1>}
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            currentView === 'dashboard' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          {!sidebarCollapsed && <span>Dashboard</span>}
        </button>
        
        <button
          onClick={() => setCurrentView('chat')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            currentView === 'chat' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          {!sidebarCollapsed && <span>New Chat</span>}
        </button>
       
        
        <button
          onClick={() => setCurrentView('library')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            currentView === 'library' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
          }`}
        >
          <FileText className="w-5 h-5" />
          {!sidebarCollapsed && <span>Audit Library</span>}
        </button>

        <button
          onClick={() => setCurrentView('action-plan')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            currentView === 'action-plan' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          {!sidebarCollapsed && <span>Action Plan</span>}
        </button>
      </nav>

      {!sidebarCollapsed && (
        <>
          <div className="px-4 py-2 text-xs text-gray-500 font-medium">Chats</div>
          <div className="px-4 pb-4 space-y-1">
            {mockChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  setCurrentView('chat');
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  selectedChat.id === chat.id ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                {chat.name}
              </button>
            ))}
          </div>
        </>
      )}
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
            AB
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1">
              <p className="font-medium text-sm">Aaryan Baadkar</p>
              <p className="text-xs text-gray-500">Free</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Top header (for auth pages)
  const MarketingHeader = () => (
    <div className="w-full flex items-center justify-between px-10 py-6">
      <div className="text-2xl font-extrabold tracking-tight">Jentry</div>
      <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
        <button className="hover:text-gray-900">Features</button>
        <button className="hover:text-gray-900">Dashboard</button>
        <button className="hover:text-gray-900">Modules</button>
        <button className="hover:text-gray-900">Insights</button>
      </nav>
      <div className="flex items-center gap-3">
        <button onClick={() => setCurrentView('signup')} className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50">Sign up</button>
        <button onClick={() => setCurrentView('login')} className="px-4 py-2 rounded-full border border-gray-900 bg-black text-white hover:bg-gray-800">Log in</button>
      </div>
    </div>
  );

  // Login View
  const LoginView = () => (
    <div className="flex-1 bg-white flex flex-col">
      <MarketingHeader />
      <div className="flex-1 grid md:grid-cols-2 gap-8 px-8 md:px-16 py-8">
        <div className="max-w-xl mx-auto w-full flex flex-col justify-center">
          <div>
            <div className="text-5xl font-extrabold tracking-tight mb-6">JENTRY</div>
            <h2 className="text-3xl font-bold mb-8">Log In</h2>
          </div>
          <label className="block text-sm font-medium mb-2">Email / Username</label>
          <input className="w-full px-5 py-4 rounded-full border border-gray-300 mb-6" placeholder="Email/ Username" />
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Password</label>
            <button className="text-sm text-gray-600 hover:text-gray-900">Forgot Password</button>
          </div>
          <input type="password" className="w-full px-5 py-4 rounded-full border border-gray-300 mb-4" placeholder="Password" />
          <div className="flex items-center gap-2 mb-6 text-sm">
            <input id="remember" type="checkbox" className="w-4 h-4" />
            <label htmlFor="remember">Remember Me</label>
          </div>
          <button onClick={() => setCurrentView('dashboard')} className="w-full px-6 py-4 rounded-full bg-black text-white font-medium">Log in</button>
          <div className="flex items-center gap-6 my-8">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          <div className="flex items-center gap-6 text-2xl text-gray-700">
            <span className="i-carbon-logo-google"></span>
            <span className="i-carbon-logo-facebook"></span>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden min-h-[360px] md:min-h-[640px]">
          <img className="w-full h-full object-cover" src="C:\Users\Laptop\OneDrive\Documents\Code\Jentry\Jentry\src\image 1.png" alt="Farm field" />
        </div>
      </div>  
    </div>
  );

  // Signup mirrors login headline/buttons
  const SignupView = () => (
    <div className="flex-1 bg-white flex flex-col">
      <MarketingHeader />
      <div className="flex-1 grid md:grid-cols-2 gap-8 px-8 md:px-16 py-8">
        <div className="max-w-xl mx-auto w-full flex flex-col justify-center">
          <div>
            <div className="text-5xl font-extrabold tracking-tight mb-6">JENTRY</div>
            <h2 className="text-3xl font-bold mb-8">Create Account</h2>
          </div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input className="w-full px-5 py-4 rounded-full border border-gray-300 mb-4" placeholder="name@company.com" />
          <label className="block text-sm font-medium mb-2">Password</label>
          <input type="password" className="w-full px-5 py-4 rounded-full border border-gray-300 mb-6" placeholder="••••••••" />
          <button onClick={() => setCurrentView('dashboard')} className="w-full px-6 py-4 rounded-full bg-black text-white font-medium">Sign up</button>
        </div>
        <div className="rounded-3xl overflow-hidden min-h-[360px] md:min-h-[640px]">
          <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop" alt="Farmer using tablet" />
        </div>
      </div>
    </div>
  );

  // Dashboard View
  const DashboardView = () => {
    const performanceTrend = [
      { month: 'Jan', planned: 42, completed: 38 },
      { month: 'Feb', planned: 44, completed: 41 },
      { month: 'Mar', planned: 46, completed: 43 },
      { month: 'Apr', planned: 48, completed: 45 },
      { month: 'May', planned: 50, completed: 47 },
      { month: 'Jun', planned: 52, completed: 49 },
      { month: 'Jul', planned: 54, completed: 51 },
      { month: 'Aug', planned: 55, completed: 53 },
      { month: 'Sep', planned: 56, completed: 54 },
      { month: 'Oct', planned: 57, completed: 55 },
      { month: 'Nov', planned: 58, completed: 56 },
      { month: 'Dec', planned: 60, completed: 58 },
    ];

    const trendMax = Math.max(...performanceTrend.flatMap(p => [p.planned, p.completed]));
    const getPoint = (value, index) => {
      const x = performanceTrend.length > 1 ? (index / (performanceTrend.length - 1)) * 100 : 0;
      const y = 100 - (value / trendMax) * 100;
      return `${x},${y}`;
    };
    const plannedPoints = performanceTrend.map((p, i) => getPoint(p.planned, i)).join(' ');
    const completedPoints = performanceTrend.map((p, i) => getPoint(p.completed, i)).join(' ');

    const latestTrend = performanceTrend[performanceTrend.length - 1];

    const regionCompliance = [
      { region: 'North', score: 92 },
      { region: 'South', score: 86 },
      { region: 'East', score: 78 },
      { region: 'West', score: 83 },
    ];

    const riskBreakdown = [
      { label: 'Operational', value: 32, color: 'bg-amber-500' },
      { label: 'Documentation', value: 27, color: 'bg-blue-500' },
      { label: 'Regulatory', value: 21, color: 'bg-purple-500' },
      { label: 'Financial', value: 20, color: 'bg-emerald-500' },
    ];

    const upcomingMilestones = [
      { title: 'Water Management Audit Review', date: 'Aug 12, 2024', owner: 'Olivia Bennett' },
      { title: 'Upload Soil Health Evidence', date: 'Aug 16, 2024', owner: 'Ethan Carter' },
      { title: 'Executive Summary Sign-off', date: 'Aug 22, 2024', owner: 'Noah Thompson' },
    ];

    const openIssues = [
      { issue: 'Missing Soil Health Report', owner: 'Field Ops', status: 'Escalated' },
      { issue: 'Pesticide Usage Variance', owner: 'Compliance', status: 'Reviewing' },
      { issue: 'Cold Storage Logs', owner: 'Quality', status: 'Awaiting Data' },
    ];

    return (
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Executive Dashboard</h1>
              <p className="text-gray-600">Monitor audit throughput, compliance performance, and emerging risks.</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowNewAudit(true)} className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition">
                Start New Audit
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Hi, Aaryan</span>
                <div className="w-10 h-10 rounded-full bg-gray-600"></div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-600">Active Audits</div>
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">24</div>
              <p className="text-xs text-green-600 mt-2">↑ 8% vs last month</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-600">Average Compliance</div>
                <BarChart3 className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">84%</div>
              <p className="text-xs text-emerald-600 mt-2">+5 pts vs Q1 baseline</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-600">Critical Findings</div>
                <AlertCircle className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">6</div>
              <p className="text-xs text-rose-600 mt-2">2 new in the last 7 days</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-600">SLA On-Time Rate</div>
                <Clock className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">92%</div>
              <p className="text-xs text-indigo-600 mt-2">↑ 3 pts week-over-week</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Audit Completion Velocity</h2>
                <span className="text-xs text-gray-500">Rolling 12 months</span>
              </div>
              <div className="mt-6">
                <svg viewBox="0 0 100 100" className="w-full h-48">
                  <polyline
                    fill="none"
                    stroke="#CBD5F5"
                    strokeWidth="2"
                    points={plannedPoints}
                    strokeDasharray="4 4"
                  />
                  <polyline
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="3"
                    strokeLinecap="round"
                    points={completedPoints}
                  />
                  <circle cx="100" cy={100 - (latestTrend.completed / trendMax) * 100} r="2" fill="#2563EB" />
                </svg>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  {performanceTrend.map(point => (
                    <span key={point.month}>{point.month}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <span>Completed Audits</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border border-blue-300 bg-blue-100"></span>
                  <span>Planned Throughput</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Regional Compliance Snapshot</h2>
              <div className="space-y-4">
                {regionCompliance.map(region => (
                  <div key={region.region}>
                    <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                      <span>{region.region}</span>
                      <span>{region.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ width: `${region.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Risk Breakdown</h2>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="60" fill="#EEF2FF" />
                    {riskBreakdown.reduce((acc, slice, index) => {
                      const total = riskBreakdown.reduce((sum, item) => sum + item.value, 0);
                      const startAngle = acc.endAngle;
                      const angle = (slice.value / total) * 360;
                      const endAngle = startAngle + angle;
                      const largeArc = angle > 180 ? 1 : 0;
                      const start = {
                        x: 80 + 60 * Math.cos((Math.PI / 180) * (startAngle - 90)),
                        y: 80 + 60 * Math.sin((Math.PI / 180) * (startAngle - 90)),
                      };
                      const end = {
                        x: 80 + 60 * Math.cos((Math.PI / 180) * (endAngle - 90)),
                        y: 80 + 60 * Math.sin((Math.PI / 180) * (endAngle - 90)),
                      };
                      acc.paths.push(
                        <path
                          key={slice.label}
                          d={`M${start.x},${start.y} A60,60 0 ${largeArc} 1 ${end.x},${end.y} L80,80 Z`}
                          className={slice.color}
                          opacity="0.85"
                        />
                      );
                      acc.endAngle = endAngle;
                      return acc;
                    }, { endAngle: 0, paths: [] }).paths}
                    <circle cx="80" cy="80" r="32" fill="white" />
                    <text x="80" y="75" textAnchor="middle" className="text-2xl font-bold fill-gray-900">100%</text>
                    <text x="80" y="95" textAnchor="middle" className="text-xs fill-gray-500">Risk Coverage</text>
                  </svg>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {riskBreakdown.map(item => (
                  <div key={item.label} className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                      <span>{item.label}</span>
                    </div>
                    <span>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Upcoming Milestones</h2>
              <div className="space-y-4">
                {upcomingMilestones.map(milestone => (
                  <div key={milestone.title} className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{milestone.title}</p>
                      <p className="text-xs text-gray-500">Owner: {milestone.owner}</p>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {milestone.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Open Issues</h2>
              <div className="space-y-3">
                {openIssues.map(issue => (
                  <div key={issue.issue} className="border border-gray-100 rounded-lg p-3">
                    <p className="font-medium text-sm text-gray-900">{issue.issue}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                      <span>Owner: {issue.owner}</span>
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        issue.status === 'Escalated'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {issue.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">AI Summary</h2>
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                AI-generated insights will surface emerging anomalies and recommend prioritised remediation once new audit files are processed.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Chat View
  const ChatView = () => (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Jentry</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigator.clipboard.writeText(window.location.href).catch(() => {})} className="p-2 hover:bg-gray-100 rounded-lg">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-8">
        {selectedChat.message && (
          <>
            <div className="flex justify-end mb-6">
              <div className="bg-gray-100 rounded-2xl rounded-tr-sm px-6 py-4 max-w-2xl">
                <p className="text-gray-900">{selectedChat.message}</p>
              </div>
            </div>
            
            {selectedChat.response && (
              <div className="mb-6">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-6 py-4 max-w-3xl">
                  <p className="text-gray-900 leading-relaxed">{selectedChat.response}</p>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setSelectedChat({ ...selectedChat, response: 'I re-checked your files. The referenced soil report is still not in the uploaded folder. Try syncing your Operator Documents.zip, or upload the PDF directly.' })} className="p-2 hover:bg-gray-100 rounded-lg">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button onClick={() => navigator.clipboard.writeText(selectedChat.response || '')} className="p-2 hover:bg-gray-100 rounded-lg">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="border-t border-gray-200 p-6">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <button className="p-3 hover:bg-gray-100 rounded-full">
            <Plus className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask Anything"
            className="flex-1 px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:border-gray-400"
          />
          <button
            onClick={() => {
              if (!chatInput.trim()) return;
              setSelectedChat({ id: Date.now(), name: 'New', message: chatInput, response: 'Working on it…' });
              setChatInput('');
            }}
            className="p-3 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  // Audit Library View
  const AuditLibraryView = () => (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Audit Library</h1>
            <p className="text-gray-600">Manage and track your compliance assessments</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search audits..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 w-64"
              />
            </div>
            <button
              onClick={() => setShowNewAudit(true)}
              className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Start New Audit
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Hi, Aaryan</span>
              <div className="w-10 h-10 rounded-full bg-gray-600"></div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-bold mb-4">Audit Performance Overview</h2>
          <p className="text-sm text-gray-600 mb-6">24 audits conducted in the last 30 days</p>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                <CheckCircle className="w-6 h-6" />
                <span className="text-3xl font-bold">12</span>
              </div>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
                <Clock className="w-6 h-6" />
                <span className="text-3xl font-bold">8</span>
              </div>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                <AlertCircle className="w-6 h-6" />
                <span className="text-3xl font-bold">4</span>
              </div>
              <p className="text-sm text-gray-600">Needs Attention</p>
            </div>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button onClick={() => setStatusFilter(statusFilter === 'all' ? 'Completed' : 'all')} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {statusFilter === 'all' ? 'Filter: All' : `Filter: ${statusFilter}`}
            </button>
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <option value="name">Sort: Name</option>
              <option value="client">Sort: Client</option>
              <option value="compliance">Sort: Compliance</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audits Display */}
        {viewMode === 'list' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Audit Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Last Modified</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Client Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Compliance Score</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Assigned To</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedAudits.map((audit, idx) => (
                  <tr key={audit.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div 
                              className={`h-2 rounded-full ${
                                audit.compliance >= 80 ? 'bg-green-500' :
                                audit.compliance >= 60 ? 'bg-yellow-500' :
                                audit.compliance >= 40 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{width: `${audit.compliance}%`}}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600">{audit.requirements}</p>
                        </div>
                        <span className="font-bold text-sm">{audit.compliance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {audit.assignedTo.map((initials, i) => (
                          <div key={i} className={`w-8 h-8 rounded-full ${
                            i === 0 ? 'bg-blue-600' : 'bg-gray-600'
                          } flex items-center justify-center text-white text-xs font-medium border-2 border-white`}>
                            {initials}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleViewAudit(audit)} className="p-2 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setSelectedAudit(audit); setAuditModalMode('edit'); }} className="p-2 hover:bg-gray-100 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">Showing {Math.min(page * pageSize, filteredSortedAudits.length)} of {filteredSortedAudits.length} audits</p>
              <div className="flex items-center gap-2">
                <button disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
                <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">{page}</span>
                <button disabled={page === totalPages} onClick={() => setPage(Math.min(totalPages, page + 1))} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {pagedAudits.map((audit) => (
              <div key={audit.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                      audit.color === 'green' ? 'bg-green-100' :
                      audit.color === 'yellow' ? 'bg-yellow-100' :
                      audit.color === 'blue' ? 'bg-blue-100' : 'bg-red-100'
                    }`}>
                      {audit.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{audit.name}</h3>
                      <p className="text-xs text-gray-500">{audit.id}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      audit.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      audit.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                      audit.status === 'Pending Review' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {audit.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Client:</span>
                    <div className="text-right">
                      <p className="text-sm font-medium">{audit.client}</p>
                      <p className="text-xs text-gray-500">{audit.clientType}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Modified:</span>
                    <p className="text-sm">{audit.lastModified}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Compliance Score:</span>
                    <span className="font-bold">{audit.compliance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        audit.compliance >= 80 ? 'bg-green-500' :
                        audit.compliance >= 60 ? 'bg-yellow-500' :
                        audit.compliance >= 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{width: `${audit.compliance}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{audit.requirements}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex -space-x-2">
                    {audit.assignedTo.map((initials, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full ${
                        i === 0 ? 'bg-blue-600' : 'bg-gray-600'
                      } flex items-center justify-center text-white text-xs font-medium border-2 border-white`}>
                        {initials}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleViewAudit(audit)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button onClick={() => { setSelectedAudit(audit); setAuditModalMode('edit'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-span-2 flex items-center justify-between">
              <p className="text-sm text-gray-600">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <button disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
                <button disabled={page === totalPages} onClick={() => setPage(Math.min(totalPages, page + 1))} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // New Audit Modal
  const NewAuditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">New Audit</h2>
          <button onClick={() => setShowNewAudit(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Progress Steps */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-2">
            <div className={`flex-1 h-2 rounded-full ${auditStep >= 1 ? 'bg-black' : 'bg-gray-200'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${auditStep >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${auditStep >= 3 ? 'bg-black' : 'bg-gray-200'}`}></div>
          </div>
          <p className="text-sm text-gray-600">Step {auditStep} of 3</p>
        </div>
        
        <div className="p-6">
          {auditStep === 1 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Audit Details</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Audit Title/Reference Number</label>
                  <input
                    type="text"
                    placeholder="Enter audit title or reference number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                    value={auditForm.title}
                    onChange={(e) => setAuditForm({...auditForm, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Farm Operator Name</label>
                  <input
                    type="text"
                    placeholder="Enter farm operator name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                    value={auditForm.operator}
                    onChange={(e) => setAuditForm({...auditForm, operator: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Farm Location</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                    value={auditForm.location}
                    onChange={(e) => setAuditForm({...auditForm, location: e.target.value})}
                  >
                    <option value="">Select farm location</option>
                    <option value="north">North Region</option>
                    <option value="south">South Region</option>
                    <option value="east">East Region</option>
                    <option value="west">West Region</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Audit Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                    value={auditForm.date}
                    onChange={(e) => setAuditForm({...auditForm, date: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Relevant Regulatory Standard</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                    value={auditForm.standard}
                    onChange={(e) => setAuditForm({...auditForm, standard: e.target.value})}
                  >
                    <option value="">Select regulatory standard</option>
                    <option value="iso">ISO 9001</option>
                    <option value="organic">USDA Organic</option>
                    <option value="gmp">GMP Standards</option>
                    <option value="gap">GAP Certification</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {auditStep === 2 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Source Document Upload</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center mb-6">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h4 className="font-bold mb-2">Drag and drop files here</h4>
                <p className="text-sm text-gray-600 mb-4">Upload audit reports, operator documents, photos, or videos. Our system automatically digitizes and indexes content.</p>
                <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">
                  Browse Files
                </button>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Uploaded Files</h4>
                <div className="space-y-3">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm">{file.name}</span>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {auditStep === 3 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Team & Client Participants</h3>
              
              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Participant Name</label>
                  <input
                    type="text"
                    placeholder="Enter participant name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400">
                    <option value="">Select role</option>
                    <option value="auditor">Field Auditor</option>
                    <option value="reviewer">Senior Reviewer</option>
                    <option value="manager">Farm Manager</option>
                    <option value="coordinator">Audit Coordinator</option>
                  </select>
                </div>
                
                <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">
                  Add Participant
                </button>
              </div>
              
              <div className="space-y-3">
                {auditForm.participants.map((participant, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-sm text-gray-600">{participant.role}</p>
                    </div>
                    <button className="p-2 hover:bg-gray-200 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-between">
          {auditStep > 1 && (
            <button
              onClick={() => setAuditStep(auditStep - 1)}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Back
            </button>
          )}
          {auditStep < 3 ? (
            <button
              onClick={() => setAuditStep(auditStep + 1)}
              className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => {
                const locationMap = {
                  north: 'North Region',
                  south: 'South Region',
                  east: 'East Region',
                  west: 'West Region',
                };
                const newAudit = {
                  id: `AUD-${Date.now()}`,
                  name: auditForm.title || 'Untitled Audit',
                  client: auditForm.operator || 'Pending Operator',
                  clientType: locationMap[auditForm.location] || 'Unassigned',
                  status: 'In Progress',
                  lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                  time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                  compliance: 0,
                  requirements: '0/0 requirements met',
                  assignedTo: ['AB', 'JD'],
                  icon: '📄',
                  color: 'blue',
                };
                setAudits(prev => [newAudit, ...prev]);
                setActiveAudit(newAudit);
                setShowNewAudit(false);
                setAuditStep(1);
                setAuditForm({
                  title: '',
                  operator: '',
                  location: '',
                  date: '',
                  standard: '',
                  participants: [
                    { name: 'Ethan Carter', role: 'Field Auditor' },
                    { name: 'Olivia Bennett', role: 'Senior Reviewer' },
                    { name: 'Noah Thompson', role: 'Farm Manager' }
                  ]
                });
                setCurrentView('simulation');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 ml-auto"
            >
              Finalize & Begin AI Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // View/Edit Audit Modal
  const AuditDetailsModal = () => {
    const [local, setLocal] = useState(selectedAudit);
    useEffect(() => {
      setLocal(selectedAudit);
    }, [selectedAudit]);
    if (!selectedAudit || auditModalMode !== 'edit') return null;
    if (!local) return null;
    const readonly = false;
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-bold">{readonly ? 'View Audit' : 'Edit Audit'}</h3>
            <button onClick={() => setSelectedAudit(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Audit Name</label>
              <input disabled={readonly} value={local.name} onChange={(e)=>setLocal({...local, name:e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Client</label>
                <input disabled={readonly} value={local.client} onChange={(e)=>setLocal({...local, client:e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select disabled={readonly} value={local.status} onChange={(e)=>setLocal({...local, status:e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg">
                  <option>Completed</option>
                  <option>In Progress</option>
                  <option>Pending Review</option>
                  <option>Needs Attention</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Compliance (%)</label>
                <input type="number" disabled={readonly} value={local.compliance} onChange={(e)=>setLocal({...local, compliance:Number(e.target.value)})} className="w-full mt-1 px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium">Requirements</label>
                <input disabled={readonly} value={local.requirements} onChange={(e)=>setLocal({...local, requirements:e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg" />
              </div>
            </div>
          </div>
          <div className="p-6 border-t flex justify-end gap-2">
            {!readonly && (
              <button
                onClick={() => {
                  setAudits(prev => prev.map(a => a.id === local.id ? { ...a, ...local } : a));
                  if (activeAudit && activeAudit.id === local.id) {
                    setActiveAudit(prev => ({ ...prev, ...local }));
                  }
                  setSelectedAudit(null);
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save Changes
              </button>
            )}
            <button onClick={()=> setSelectedAudit(null)} className="px-5 py-2 border rounded-lg">Close</button>
          </div>
        </div>
      </div>
    );
  };

  // AI Simulation View
  const SimulationView = () => {
    const [taskFilter, setTaskFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const simulationTasks = useMemo(() => {
      const name = activeAudit?.name || 'Selected Audit';
      return [
        { name: `Validate source documents referenced in ${name}`, priority: 'High', status: 'In Progress', due: '2024-07-15' },
        { name: `Assess control coverage for ${activeAudit?.client || 'client portfolio'}`, priority: 'Medium', status: 'Queued', due: '2024-07-17' },
        { name: 'Evaluate model performance metrics', priority: 'Low', status: 'Queued', due: '2024-07-20' },
        { name: 'Bias & data quality diagnostics', priority: 'High', status: 'Pending Review', due: '2024-07-24' },
        { name: 'Compile regulatory compliance summary', priority: 'Medium', status: 'Not Started', due: '2024-07-28' },
      ];
    }, [activeAudit]);

    const filteredTasks = useMemo(() => {
      return simulationTasks.filter(task => {
        const matchesPriority = taskFilter === 'all' || task.priority === taskFilter;
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        return matchesPriority && matchesStatus;
      });
    }, [simulationTasks, taskFilter, statusFilter]);

    const completion = activeAudit ? Math.min(100, Math.max(12, activeAudit.compliance - 20)) : 20;

    const statusTheme = activeAudit?.status === 'Completed'
      ? 'bg-emerald-100 text-emerald-700'
      : activeAudit?.status === 'Needs Attention'
        ? 'bg-rose-100 text-rose-700'
        : activeAudit?.status === 'Pending Review'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-amber-100 text-amber-700';

    return (
      <div className="flex-1 overflow-auto bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">AI Audit Simulation</h1>
              <p className="text-gray-600">
                {activeAudit
                  ? `AI is processing ${activeAudit.name} for ${activeAudit.client}.`
                  : 'Select an audit from the library to begin simulation.'}
              </p>
            </div>
            {activeAudit && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusTheme}`}>
                {activeAudit.status}
              </span>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <p className="text-xs font-medium text-gray-500 uppercase">Current Completion</p>
              <div className="flex items-end gap-2 mt-4">
                <span className="text-4xl font-bold text-gray-900">{completion}%</span>
                <span className="text-xs text-gray-500 mb-1">of automated checks finished</span>
              </div>
              <div className="mt-4 w-full h-2 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${completion}%` }} />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <p className="text-xs font-medium text-gray-500 uppercase">Files Digitised</p>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-4xl font-bold text-gray-900">{activeAudit ? 18 : 0}</span>
                <span className="text-xs text-gray-500">of 24 required</span>
              </div>
              <p className="text-xs text-emerald-600 mt-3">+3 documents in the last hour</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <p className="text-xs font-medium text-gray-500 uppercase">Automated Flags</p>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-4xl font-bold text-gray-900">{activeAudit ? 5 : 0}</span>
                <span className="text-xs text-gray-500">requiring manual review</span>
              </div>
              <p className="text-xs text-rose-600 mt-3">Critical anomalies detected in supplier invoices</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold">Simulation Task Board</h2>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-full border border-gray-200 p-1 text-sm bg-gray-50">
                  {['all', 'High', 'Medium', 'Low'].map(level => (
                    <button
                      key={level}
                      onClick={() => setTaskFilter(level)}
                      className={`px-3 py-1 rounded-full ${
                        taskFilter === level ? 'bg-black text-white' : 'text-gray-600'
                      }`}
                    >
                      {level === 'all' ? 'All' : level}
                    </button>
                  ))}
                </div>
                <div className="inline-flex rounded-full border border-gray-200 p-1 text-sm bg-gray-50">
                  {['all', 'In Progress', 'Pending Review', 'Queued', 'Not Started'].map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1 rounded-full ${
                        statusFilter === status ? 'bg-blue-600 text-white' : 'text-gray-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-hidden border border-gray-100 rounded-xl">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Task</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Priority</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{task.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'High'
                            ? 'bg-rose-100 text-rose-700'
                            : task.priority === 'Medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.status === 'In Progress'
                            ? 'bg-indigo-100 text-indigo-700'
                            : task.status === 'Pending Review'
                              ? 'bg-blue-100 text-blue-700'
                              : task.status === 'Queued'
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-slate-100 text-slate-600'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{task.due}</td>
                    </tr>
                  ))}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-6 text-center text-sm text-gray-500">
                        No tasks match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-500">
              Audit standard simulated: <span className="font-medium text-gray-800">{activeAudit?.standard || 'GAP / USDA Blend'}</span>
            </div>
            <button
              onClick={() => setCurrentView('action-plan')}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Continue to Action Plan
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Action Plan View
  const ActionPlanView = () => {
    const [actionTasks, setActionTasks] = useState([
      { name: 'Request missing Invoice #402', due: '2024-03-15', finding: '#201', complete: false, priority: 'High' },
      { name: 'Review and approve audit report', due: '2024-03-20', finding: '#203', complete: false, priority: 'Medium' },
      { name: 'Follow up on outstanding documentation', due: '2024-03-22', finding: '#202', complete: false, priority: 'Low' }
    ]);
    const [apSort, setApSort] = useState('priority');
    const [apFilter, setApFilter] = useState('all');
    const [approved, setApproved] = useState(null); // null|true|false

    const visibleTasks = useMemo(() => {
      let items = [...actionTasks];
      if (apFilter !== 'all') items = items.filter(t => (apFilter === 'complete' ? t.complete : !t.complete));
      if (apSort === 'due') items.sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
      if (apSort === 'priority') {
        const order = { High: 0, Medium: 1, Low: 2 };
        items.sort((a, b) => order[a.priority] - order[b.priority]);
      }
      if (apSort === 'sequence') return items; // predefined
      return items;
    }, [actionTasks, apFilter, apSort]);

    return (
      <div className="flex-1 overflow-auto bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Action Plan: Next Steps</h1>
              <p className="text-gray-600">As a Senior Reviewer, prioritize critical follow-ups</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-bold mb-4">Senior Reviewer Actions</h3>
              <p className="text-sm text-gray-600 mb-4">Approve or reject the audit based on the findings.</p>
              <div className="flex gap-2">
                <button onClick={() => setApproved(true)} className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">Approve</button>
                <button onClick={() => setApproved(false)} className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Reject</button>
              </div>
            </div>
          </div>
          {approved !== null && (
            <div className={`mb-6 p-4 rounded-lg border ${approved ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              {approved ? 'Audit approved successfully. Action plan closed.' : 'Audit rejected. Please address required findings and resubmit.'}
            </div>
          )}
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Audit Completion Status</h2>
              <span className="text-2xl font-bold">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-black h-3 rounded-full" style={{width: '75%'}}></div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Sort & Filter</h2>
            <div className="flex gap-4 mb-4">
              <button onClick={() => setApSort('priority')} className={`px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 ${apSort==='priority'?'border-black':'border-gray-300'}`}>Sort By: Priority</button>
              <button onClick={() => setApSort('due')} className={`px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 ${apSort==='due'?'border-black':'border-gray-300'}`}>Sort By: Due Date</button>
              <button onClick={() => setApSort('sequence')} className={`px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 ${apSort==='sequence'?'border-black':'border-gray-300'}`}>Sort By: Recommended Sequence</button>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setApFilter('incomplete')} className={`px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 ${apFilter==='incomplete'?'border-black':'border-gray-300'}`}>Filter By: Incomplete</button>
              <button onClick={() => setApFilter('complete')} className={`px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 ${apFilter==='complete'?'border-black':'border-gray-300'}`}>Filter By: Complete</button>
              <button onClick={() => setApFilter('all')} className={`px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 ${apFilter==='all'?'border-black':'border-gray-300'}`}>Show All</button>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Tasks</h2>
            <div className="space-y-4">
              {visibleTasks.map((task, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{task.name}</h3>
                    <p className="text-sm text-gray-600">Due: {task.due} • Priority: {task.priority}</p>
                    <p className="text-sm text-gray-600">Related to AI Finding: {task.finding}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={task.complete}
                    onChange={() => setActionTasks(prev => prev.map((t, i) => i===idx ? { ...t, complete: !t.complete } : t))}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen bg-white flex">
      {(currentView !== 'login' && currentView !== 'signup') && <Sidebar />}
      <div className="flex-1 flex">
        {currentView === 'login' && <LoginView />}
        {currentView === 'signup' && <SignupView />}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'chat' && <ChatView />}
        {currentView === 'library' && <AuditLibraryView />}
        {currentView === 'simulation' && <SimulationView />}
        {currentView === 'action-plan' && <ActionPlanView />}
        {currentView === 'search' && <ChatView />}
      </div>
      {showNewAudit && <NewAuditModal />}
      {selectedAudit && auditModalMode === 'edit' && <AuditDetailsModal />}
    </div>
  );
};

export default JentryPlatform;
                   