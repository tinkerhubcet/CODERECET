import React from 'react';

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

export default SettingsComponent;
