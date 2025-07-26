import React from 'react';

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

export default ReportsComponent;
