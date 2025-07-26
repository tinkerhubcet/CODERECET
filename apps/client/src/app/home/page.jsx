'use client'
import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Pill, 
  Activity, 
  FileText, 
  Phone,
  Shield,
  Users,
  Settings,
  Menu,
  X,
  Home,
  MessageCircle,
  Bell,
  User,
  Send,
  Bot
} from 'lucide-react';

// Simple Chat Component
const ChatComponent = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Vitalis AI, your personal health assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages([...messages, newMessage]);
      setInputMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: "I understand your concern. Based on your health profile, I'd be happy to help you with that. Let me analyze your recent data and provide personalized recommendations.",
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Bot className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Vitalis AI Assistant</h3>
          <p className="text-sm text-green-600">Online</p>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me about your health..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Component definitions
const DashboardComponent = () => (
  <div>
    {/* Welcome Section */}
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to Your Health Dashboard
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Your comprehensive wellness management center. Monitor your health, manage medications, and stay connected with your care team.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors">
          View Health Reports
        </button>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center">
          <Calendar className="mr-2 h-5 w-5" />
          Schedule Appointment
        </button>
      </div>
    </div>

    {/* Quick Stats Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Next Appointment</p>
            <p className="text-lg font-semibold text-gray-900">Tomorrow 2PM</p>
          </div>
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Medications</p>
            <p className="text-lg font-semibold text-green-600">On Schedule</p>
          </div>
          <Pill className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Activity Goal</p>
            <p className="text-lg font-semibold text-blue-600">75% Complete</p>
          </div>
          <Activity className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Emergency Contacts</p>
            <p className="text-lg font-semibold text-gray-900">3 Active</p>
          </div>
          <Phone className="h-8 w-8 text-red-500" />
        </div>
      </div>
    </div>

    {/* Main Content Grid with Chat Embedded */}
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Recent Activity - Takes 2 columns */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Medication taken</p>
                <p className="text-sm text-gray-500">Blood pressure medication - 8:00 AM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Appointment scheduled</p>
                <p className="text-sm text-gray-500">Dr. Smith - Tomorrow 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Health report analyzed</p>
                <p className="text-sm text-gray-500">Blood work results reviewed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">Schedule Appointment</span>
            </button>
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Pill className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-900">Order Medications</span>
            </button>
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="h-5 w-5 text-red-600" />
              <span className="font-medium text-gray-900">Emergency Contacts</span>
            </button>
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Health Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Component - Takes 1 column */}
      <div className="lg:col-span-1">
        <ChatComponent />
      </div>
    </div>
  </div>
);

const ChatPageComponent = () => (
  <div className="max-w-4xl mx-auto">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Chat with Vitalis AI</h2>
      <p className="text-gray-600">Get personalized health insights and assistance from your AI health companion.</p>
    </div>
    <div className="h-96">
      <ChatComponent />
    </div>
  </div>
);

const AppointmentsComponent = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointments</h2>
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">Dr. Sarah Smith - Cardiology</h3>
              <p className="text-gray-600">Tomorrow, 2:00 PM</p>
              <p className="text-sm text-gray-500">Annual heart checkup</p>
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Confirmed</span>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">Dr. Michael Johnson - General</h3>
              <p className="text-gray-600">Next Friday, 10:30 AM</p>
              <p className="text-sm text-gray-500">Routine physical examination</p>
            </div>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">Scheduled</span>
          </div>
        </div>
      </div>
      <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Schedule New Appointment
      </button>
    </div>
  </div>
);

const MedicationsComponent = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadStatus('Processing prescription...');
    
    try {
      const formData = new FormData();
      formData.append('prescription', file);
      
      // Send to n8n webhook for OCR processing
      const response = await fetch('/api/ocr/prescription', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        setUploadStatus('Prescription processed successfully!');
        console.log('OCR Result:', result);
        // Handle the OCR result here (e.g., pre-fill medication form)
      } else {
        setUploadStatus('Error processing prescription. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(''), 3000);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      handleFileUpload(file);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Medications</h2>
        
        {/* Prescription Upload Section */}
        <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload Prescription</h3>
          <div
            className={`relative p-6 border-2 border-dashed rounded-lg transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="prescription-upload"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">
                  {isUploading ? 'Processing...' : 'Drop your prescription here'}
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse (Images and PDF files supported)
                </p>
                {uploadedFile && !isUploading && (
                  <p className="text-sm text-blue-600 font-medium">
                    Selected: {uploadedFile.name}
                  </p>
                )}
                {uploadStatus && (
                  <p className={`text-sm font-medium ${
                    uploadStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {uploadStatus}
                  </p>
                )}
              </div>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600 font-medium">Processing prescription...</span>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Upload your prescription and our AI will automatically extract medication information using OCR technology.
          </p>
        </div>

        {/* Existing Medications List */}
        <div className="space-y-4">
          {/* ...existing code... */}
        </div>
        <div className="flex space-x-3 mt-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add New Medication
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Import from Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

const HealthTrackingComponent = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Tracking</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Blood Pressure</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Latest Reading</span>
              <span className="font-medium">120/80 mmHg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="text-sm text-gray-500">Today, 8:00 AM</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Blood Sugar</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Latest Reading</span>
              <span className="font-medium">95 mg/dL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="text-sm text-gray-500">Today, 7:30 AM</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
      <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Add New Reading
      </button>
    </div>
  </div>
);

const ReportsComponent = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Reports</h2>
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">Blood Work Analysis</h3>
              <p className="text-gray-600">Complete metabolic panel results</p>
              <p className="text-sm text-gray-500">Generated on Jan 20, 2025</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800">Download PDF</button>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">Monthly Health Summary</h3>
              <p className="text-gray-600">Comprehensive wellness overview</p>
              <p className="text-sm text-gray-500">Generated on Jan 15, 2025</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800">Download PDF</button>
          </div>
        </div>
      </div>
      <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Generate New Report
      </button>
    </div>
  </div>
);

const NotificationsComponent = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
          <Bell className="h-5 w-5 text-blue-600 mt-1" />
          <div>
            <p className="font-medium text-gray-900">Medication Reminder</p>
            <p className="text-sm text-gray-600">Time to take your evening Metformin</p>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
          <Calendar className="h-5 w-5 text-green-600 mt-1" />
          <div>
            <p className="font-medium text-gray-900">Appointment Confirmed</p>
            <p className="text-sm text-gray-600">Dr. Smith appointment confirmed for tomorrow 2 PM</p>
            <p className="text-xs text-gray-500">4 hours ago</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
          <FileText className="h-5 w-5 text-purple-600 mt-1" />
          <div>
            <p className="font-medium text-gray-900">Report Ready</p>
            <p className="text-sm text-gray-600">Your monthly health summary is ready for review</p>
            <p className="text-xs text-gray-500">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProfileComponent = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" defaultValue="John Smith" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" defaultValue="john.smith@email.com" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input type="date" defaultValue="1950-03-15" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>
      <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Save Changes
      </button>
    </div>
  </div>
);

const SettingsComponent = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Notification Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-gray-700">Medication reminders</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-gray-700">Appointment notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-gray-700">Health report updates</span>
            </label>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Emergency Contacts</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">Sarah Smith (Daughter)</p>
                <p className="text-sm text-gray-500">+1 (555) 987-6543</p>
              </div>
              <button className="text-red-600 hover:text-red-800">Remove</button>
            </div>
          </div>
          <button className="mt-2 text-blue-600 hover:text-blue-800">Add Emergency Contact</button>
        </div>
      </div>
      <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Save Settings
      </button>
    </div>
  </div>
);

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'chat', icon: MessageCircle, label: 'Chat Assistant' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'medications', icon: Pill, label: 'Medications' },
    { id: 'health', icon: Activity, label: 'Health Tracking' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const components = {
    dashboard: <DashboardComponent />,
    chat: <ChatPageComponent />,
    appointments: <AppointmentsComponent />,
    medications: <MedicationsComponent />,
    health: <HealthTrackingComponent />,
    reports: <ReportsComponent />,
    notifications: <NotificationsComponent />,
    profile: <ProfileComponent />,
    settings: <SettingsComponent />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100 fixed top-0 w-full z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <button 
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="bg-blue-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Vitalis</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600 hidden sm:block">HIPAA Compliant</span>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 z-20 h-full w-64 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6">
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setActiveComponent(item.id);
                    setIsSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${
                    activeComponent === item.id 
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Heart className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-semibold text-gray-900 text-sm">Health Status</span>
            </div>
            <p className="text-green-600 text-sm font-medium">All systems normal</p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-6">
          {components[activeComponent]}
        </div>
      </main>
    </div>
  );
}