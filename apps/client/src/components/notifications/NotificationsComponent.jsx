import React from 'react';
import { Bell, Calendar, FileText } from 'lucide-react';

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

export default NotificationsComponent;
