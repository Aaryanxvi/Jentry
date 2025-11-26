import React, { useState } from 'react';
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
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [chatInput, setChatInput] = useState('');
  const [showNewAudit, setShowNewAudit] = useState(false);
  const [auditStep, setAuditStep] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
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

  // Dashboard View
  const DashboardView = () => (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">Overview of your audit management system</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition">
              Start New Audit
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Hi, Aaryan</span>
              <div className="w-10 h-10 rounded-full bg-gray-600"></div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="text-sm text-blue-700 mb-2 font-medium">Uploaded Documents</div>
            <div className="text-4xl font-bold text-blue-900">125</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
            <div className="text-sm text-purple-700 mb-2 font-medium">Missing Evidence</div>
            <div className="text-4xl font-bold text-purple-900">15</div>
          </div>
          <div className="bg-cyan-50 rounded-xl p-6 border border-cyan-100">
            <div className="text-sm text-cyan-700 mb-2 font-medium">Unread Messages</div>
            <div className="text-4xl font-bold text-cyan-900">3</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
            <div className="text-sm text-amber-700 mb-2 font-medium">Upcoming Deadlines</div>
            <div className="text-4xl font-bold text-amber-900">2</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Analysis Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5" />
              <h2 className="text-xl font-bold">2025 Analysis</h2>
            </div>
            <div className="space-y-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].reverse().map((month, idx) => (
                <div key={month} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-8">{month}</span>
                  <div className="flex-1 flex gap-1">
                    <div className="h-6 bg-blue-500 rounded" style={{width: `${Math.random() * 80 + 20}%`}}></div>
                    <div className="h-6 bg-orange-500 rounded" style={{width: `${Math.random() * 40 + 10}%`}}></div>
                    <div className="h-6 bg-teal-500 rounded" style={{width: `${Math.random() * 30 + 10}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-6 mt-6 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Comments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>PY</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-500 rounded"></div>
                <span>AC</span>
              </div>
            </div>
          </div>

          {/* Focus Areas Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5" />
              <h2 className="text-xl font-bold">Focus Areas</h2>
            </div>
            <div className="flex justify-center items-center h-64">
              <svg width="250" height="250" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="20" strokeDasharray="75 25" transform="rotate(-90 50 50)"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="20" strokeDasharray="25 75" strokeDashoffset="-75" transform="rotate(-90 50 50)"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="20" strokeDasharray="40 60" strokeDashoffset="-100" transform="rotate(-90 50 50)"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="20" strokeDasharray="35 65" strokeDashoffset="-140" transform="rotate(-90 50 50)"/>
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm">NE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-sm">N Cent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm">South</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded"></div>
                <span className="text-sm">West</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Rate and Documents */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Objective Summary</h3>
            <p className="text-sm text-gray-600 mb-4">Total Audits: 50</p>
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">42%</div>
              <div className="text-sm text-gray-600">Compliance Rate</div>
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Recent Documents</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {mockDocuments.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.type} • {doc.uploader} • {doc.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    doc.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {doc.status}
                  </span>
                  <button className="ml-3 text-blue-600 text-xs font-medium">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Summary Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4">AI Summary</h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">AI-generated insights will appear here after processing your audit data</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Chat View
  const ChatView = () => (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Jentry</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
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
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
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
          <button className="p-3 hover:bg-gray-100 rounded-full">
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
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Sort by
            </button>
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
                {mockAudits.map((audit, idx) => (
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
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
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
              <p className="text-sm text-gray-600">Showing 10 of 24 audits</p>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-3 py-1 hover:bg-gray-100 rounded-lg">2</button>
                <button className="px-3 py-1 hover:bg-gray-100 rounded-lg">3</button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {mockAudits.map((audit) => (
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
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                setShowNewAudit(false);
                setAuditStep(1);
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

  // AI Simulation View
  const SimulationView = () => {
    const [tasks] = useState([
      { name: 'Review AI Model Documentation', priority: 'High', status: 'In Progress', due: '2024-07-15' },
      { name: 'Assess Data Quality and Bias', priority: 'Medium', status: 'Not Started', due: '2024-07-20' },
      { name: 'Evaluate Model Performance Metrics', priority: 'Low', status: 'Not Started', due: '2024-07-25' },
      { name: 'Check for Compliance with Regulations', priority: 'High', status: 'Not Started', due: '2024-07-30' },
      { name: 'Prepare Audit Report', priority: 'Medium', status: 'Not Started', due: '2024-08-05' }
    ]);

    return (
      <div className="flex-1 overflow-auto bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">AI Audit Simulation</h1>
          <p className="text-gray-600 mb-8">Audit in progress - AI is analyzing your documents</p>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Audit Completion</h2>
              <span className="text-2xl font-bold">20%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-black h-3 rounded-full" style={{width: '20%'}}></div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Tasks</h2>
            <div className="flex gap-4 mb-6">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium">All</button>
              <button className="px-4 py-2 hover:bg-gray-100 rounded-lg">High Priority</button>
              <button className="px-4 py-2 hover:bg-gray-100 rounded-lg">In Progress</button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium">Task</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">Priority</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="px-6 py-4 font-medium">{task.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'High' ? 'bg-red-100 text-red-700' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{task.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8">
            <button
              onClick={() => setCurrentView('action-plan')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
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
    const [actionTasks] = useState([
      { name: 'Request missing Invoice #402', due: '2024-03-15', finding: '#201' },
      { name: 'Review and approve audit report', due: '2024-03-20', finding: '#203' },
      { name: 'Follow up on outstanding documentation', due: '2024-03-22', finding: '#202' }
    ]);

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
              <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Approve/Reject Audit
              </button>
            </div>
          </div>
          
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
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Sort By: Priority
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Sort By: Due Date
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Sort By: Recommended Sequence
              </button>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Filter By: Incomplete
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Filter By: Complete
              </button>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Tasks</h2>
            <div className="space-y-4">
              {actionTasks.map((task, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{task.name}</h3>
                    <p className="text-sm text-gray-600">Due: {task.due}</p>
                    <p className="text-sm text-gray-600">Related to AI Finding: {task.finding}</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex bg-white">
      <Sidebar />
      
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'chat' && <ChatView />}
      {currentView === 'library' && <AuditLibraryView />}
      {currentView === 'simulation' && <SimulationView />}
      {currentView === 'action-plan' && <ActionPlanView />}
      {currentView === 'search' && <ChatView />}
      
      {showNewAudit && <NewAuditModal />}
    </div>
  );
};

export default JentryPlatform;
                   