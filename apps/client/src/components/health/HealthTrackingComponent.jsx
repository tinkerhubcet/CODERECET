import React from 'react';

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

export default HealthTrackingComponent;
