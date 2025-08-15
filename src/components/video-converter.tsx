import { useState, useRef } from 'react';

interface ConversionStatus {
  status: 'idle' | 'converting' | 'success' | 'error';
  message: string;
  downloadUrl?: string;
  mp3Filename?: string;
}

export function VideoConverter() {
  const [status, setStatus] = useState<ConversionStatus>({
    status: 'idle',
    message: 'Drop your video file here or click to browse',
  });
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setStatus({
        status: 'error',
        message: 'Please select a valid video file',
      });
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 500 * 1024 * 1024) {
      setStatus({
        status: 'error',
        message: 'File size must be less than 500MB',
      });
      return;
    }

    setStatus({
      status: 'idle',
      message: `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && fileInputRef.current) {
      fileInputRef.current.files = e.dataTransfer.files;
      handleFileSelect({ target: { files: e.dataTransfer.files } } as any);
    }
  };

  const handleConvert = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setStatus({
        status: 'error',
        message: 'Please select a video file first',
      });
      return;
    }

    setStatus({
      status: 'converting',
      message: 'Converting video to MP3... This may take a few minutes.',
    });
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', file);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 10, 90));
      }, 500);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Conversion failed');
      }

      setStatus({
        status: 'success',
        message: 'Conversion completed successfully!',
        downloadUrl: result.downloadUrl,
        mp3Filename: result.mp3Filename,
      });
    } catch (error) {
      setStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Conversion failed',
      });
    }
  };

  const handleDownload = () => {
    if (status.downloadUrl) {
      const link = document.createElement('a');
      link.href = status.downloadUrl;
      link.download = status.mp3Filename || 'converted.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setStatus({
      status: 'idle',
      message: 'Drop your video file here or click to browse',
    });
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case 'success':
        return (
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'converting':
        return (
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* File Upload Area */}
      <div className="p-8">
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : status.status === 'error'
                ? 'border-red-300 bg-red-50'
                : status.status === 'success'
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4, video/avi, video/mov, video/mkv"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="space-y-4">
            {getStatusIcon()}

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {status.status === 'success'
                  ? 'Conversion Complete!'
                  : status.status === 'error'
                    ? 'Upload Error'
                    : status.status === 'converting'
                      ? 'Converting...'
                      : 'Upload Video File'}
              </h3>
              <p className="text-gray-600">{status.message}</p>
            </div>

            {status.status === 'idle' && (
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Supports MP4, AVI, MOV, MKV and more (Max 100MB)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {status.status === 'converting' && (
        <div className="px-8 pb-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Converting...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* File Info */}
      {fileInputRef.current?.files?.[0] && status.status === 'idle' && (
        <div className="px-8 pb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Selected File
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>
                <p className="font-medium text-gray-800 truncate">{fileInputRef.current.files[0].name}</p>
              </div>
              <div>
                <span className="text-gray-500">Size:</span>
                <p className="font-medium text-gray-800">
                  {(fileInputRef.current.files[0].size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <p className="font-medium text-gray-800">{fileInputRef.current.files[0].type}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-8 pb-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {status.status === 'idle' && (
            <button
              onClick={handleConvert}
              disabled={!fileInputRef.current?.files?.length}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Convert to MP3
              </span>
            </button>
          )}

          {status.status === 'success' && (
            <>
              <button
                onClick={handleDownload}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download MP3
                </span>
              </button>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Convert Another
                </span>
              </button>
            </>
          )}

          {status.status === 'error' && (
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
