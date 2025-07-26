import React, { useState } from 'react';

const MedicationsComponent = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadStatus('Processing prescription...');
    
    try {
      const formData = new FormData();
      formData.append('prescription', file);
      
      // Send to n8n webhook for OCR processing
      const response = await fetch('/api/ocr/prescription', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        setUploadStatus('Prescription processed successfully!');
        console.log('OCR Result:', result);
        // Handle the OCR result here (e.g., pre-fill medication form)
      } else {
        setUploadStatus('Error processing prescription. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(''), 3000);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      handleFileUpload(file);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Medications</h2>
        
        {/* Prescription Upload Section */}
        <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload Prescription</h3>
          <div
            className={`relative p-6 border-2 border-dashed rounded-lg transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="prescription-upload"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">
                  {isUploading ? 'Processing...' : 'Drop your prescription here'}
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse (Images and PDF files supported)
                </p>
                {uploadedFile && !isUploading && (
                  <p className="text-sm text-blue-600 font-medium">
                    Selected: {uploadedFile.name}
                  </p>
                )}
                {uploadStatus && (
                  <p className={`text-sm font-medium ${
                    uploadStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {uploadStatus}
                  </p>
                )}
              </div>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600 font-medium">Processing prescription...</span>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Upload your prescription and our AI will automatically extract medication information using OCR technology.
          </p>
        </div>

        {/* Existing Medications List */}
        <div className="space-y-4">
          {/* Add medication list here */}
        </div>
        <div className="flex space-x-3 mt-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add New Medication
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Import from Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationsComponent;
