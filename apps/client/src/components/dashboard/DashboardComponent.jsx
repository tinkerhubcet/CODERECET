import React from 'react';
import { Calendar, Pill, Activity, Phone, FileText } from 'lucide-react';

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
        {/* Simple inline chat component */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">AI</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Vitalis AI Assistant</h3>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg max-w-xs">
              <p className="text-sm">Hello! I'm Vitalis AI, your personal health assistant. How can I help you today?</p>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask me about your health..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                <span className="text-sm">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardComponent;
