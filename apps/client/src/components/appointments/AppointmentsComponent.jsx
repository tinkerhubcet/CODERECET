import React from 'react';

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

export default AppointmentsComponent;
