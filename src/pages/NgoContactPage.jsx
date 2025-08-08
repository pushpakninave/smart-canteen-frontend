// src/pages/NgoContactPage.jsx

import React from 'react';

function NgoContactPage() {
  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Contact Our NGO Partner</h2>

        <p className="text-lg text-gray-700 mb-6 text-center">
          We partner with local non-governmental organizations (NGOs) to manage food donations and support community initiatives. If you have inquiries regarding donations, volunteering, or partnerships, please reach out to our primary NGO partner below.
        </p>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-semibold">NGO Name:</span>
            <span className="text-gray-800">FoodShare Alliance</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-semibold">Contact Person:</span>
            <span className="text-gray-800">Ms. Priya Sharma</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-semibold">Email:</span>
            <span className="text-blue-600 hover:underline">contact@foodsharealliance.org</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-semibold">Phone:</span>
            <span className="text-gray-800">+91 98765 43210</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-semibold">Website:</span>
            <a href="https://www.foodsharealliance.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.foodsharealliance.org</a>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-semibold">Address:</span>
            <span className="text-gray-800 text-right">123 Community Lane, Cityville, State, 12345</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-md text-gray-600">
            For urgent matters, please call during business hours (9 AM - 5 PM IST, Mon-Fri).
          </p>
        </div>
      </div>
    </div>
  );
}

export default NgoContactPage;