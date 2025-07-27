'use client'
import React, { useState } from 'react';
import { 
  Heart, 
  Pill, 
  Activity, 
  FileText, 
  Bell,
  Shield,
  Settings,
  Menu,
  X,
  Home,
  MessageCircle,
  Calendar,
  User
} from 'lucide-react';

// Import all split components
import DashboardComponent from '@/components/dashboard/DashboardComponent';
// import ChatPageComponent from '@/components/chat/ChatPageComponent';
import AppointmentsComponent from '@/components/appointments/AppointmentsComponent';
import MedicationsComponent from '@/components/medications/MedicationsComponent';
import HealthTrackingComponent from '@/components/health/HealthTrackingComponent';
import ReportsComponent from '@/components/reports/ReportsComponent';
import NotificationsComponent from '@/components/notifications/NotificationsComponent';
import ProfileComponent from '@/components/profile/ProfileComponent';
import SettingsComponent from '@/components/settings/SettingsComponent';

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    // { id: 'chat', icon: MessageCircle, label: 'Chat Assistant' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'medications', icon: Pill, label: 'Prescriptions' },
    { id: 'health', icon: Activity, label: 'Health Tracking' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const components = {
    dashboard: <DashboardComponent />,
    // chat: <ChatPageComponent />,
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
              <div className ="bg-blue-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Vitalis</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                {/* <span className="text-sm text-gray-600 hidden sm:block">HIPAA Compliant</span> */}
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
                    setIsSidebarOpen(false);
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