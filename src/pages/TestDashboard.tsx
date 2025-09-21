import React from 'react';

const TestDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Patient Dashboard Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium">Heart Rate</h3>
            <p className="text-2xl font-bold">72 BPM</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium">Blood Oxygen</h3>
            <p className="text-2xl font-bold">98%</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium">Temperature</h3>
            <p className="text-2xl font-bold">98.6°F</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium">ECG Status</h3>
            <p className="text-lg font-bold">Normal</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Book Appointment
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2">
              View Medications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;