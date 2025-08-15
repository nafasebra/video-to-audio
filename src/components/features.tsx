import React from 'react';

function FeaturesSection() {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-800 mb-2">Fast Conversion</h3>
        <p className="text-gray-600 text-sm">High-speed conversion using optimized FFmpeg settings</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-800 mb-2">High Quality</h3>
        <p className="text-gray-600 text-sm">Professional audio quality with MP3 encoding</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-800 mb-2">Secure</h3>
        <p className="text-gray-600 text-sm">Your files are processed locally and automatically cleaned up</p>
      </div>
    </div>
  );
}

export default FeaturesSection;
