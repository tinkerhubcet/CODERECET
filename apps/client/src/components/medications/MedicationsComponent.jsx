import React, { useState, useEffect } from 'react';
import api from '@/services/api'
const MedicationsComponent = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [ocrData, setOcrData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoadingPrescriptions, setIsLoadingPrescriptions] = useState(false);

  // Fetch prescriptions on component mount
  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setIsLoadingPrescriptions(true);
    try {
      const response = await api.get('/prescription');
      console.log('Prescriptions response:', response.data);
      // Handle the response structure with data array
      if (response.data && response.data.success && response.data.data) {
        setPrescriptions(response.data.data);
      } else {
        setPrescriptions([]);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setPrescriptions([]);
    } finally {
      setIsLoadingPrescriptions(false);
    }
  };

  const handleFileUpload = async (file) => {
    
    
    setIsUploading(true);
    setUploadStatus('Processing prescription...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Send to server for file processing - axios will automatically set the correct Content-Type
      const response = await api.post('/file/prescription', formData);
      
      if (response.status === 201 && response.data.ok) {
        const result = response.data;
        setUploadStatus('File uploaded successfully! Processing with OCR...');
        
        // Extract the key from the response and send to n8n webhook for OCR processing
        const fileKey = result.data.key;
        
        try {
          const ocrResponse = await fetch('https://roshin2005.app.n8n.cloud/webhook/d8128b01-9359-4bcf-8a1e-10f7d5a68787', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: fileKey })
          });
          
          if (ocrResponse.ok) {
            const ocrResult = await ocrResponse.json();
            setUploadStatus('Prescription processed successfully with OCR!');
            console.log('OCR Result:', ocrResult);
            
            // Set the OCR data for display and editing
            if (ocrResult && ocrResult.length > 0 && ocrResult[0].output) {
                console.log(ocrResult)
              setOcrData(ocrResult[0].output);
              setIsEditing(true);
            }
          } else {
            setUploadStatus('File uploaded but OCR processing failed. Please try again.');
          }
        } catch (ocrError) {
          console.error('OCR processing error:', ocrError);
          setUploadStatus('File uploaded but OCR processing failed. Please try again.');
        }
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

  const updateOcrData = (field, value) => {
    setOcrData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateMedication = (index, field, value) => {
    setOcrData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const addMedication = () => {
    setOcrData(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name: '',
          dosage: '',
          instructions: '',
          medicalSchedules: ''
        }
      ]
    }));
  };

  const removeMedication = (index) => {
    setOcrData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const savePrescription = async () => {
    if (!ocrData) return;
    
    setIsSaving(true);
    try {
      const response = await api.post('/prescription', ocrData);
      
      if (response.status === 200 || response.status === 201) {
        setUploadStatus('Prescription saved successfully!');
        console.log('Prescription saved:', response.data);
        setIsEditing(false);
        // Refresh prescriptions list
        fetchPrescriptions();
      } else {
        setUploadStatus('Failed to save prescription. Please try again.');
      }
    } catch (error) {
      console.error('Save error:', error);
      setUploadStatus('Failed to save prescription. Please try again.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setUploadStatus(''), 3000);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setOcrData(null);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
       
        
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

        {/* OCR Results Display and Edit Section */}
        {ocrData && isEditing && (
          <div className="mb-6 p-6 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Extracted Prescription Data</h3>
              <div className="flex space-x-2">
                <button
                  onClick={savePrescription}
                  disabled={isSaving}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Prescription'}
                </button>
                <button
                  onClick={cancelEditing}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Doctor and Clinic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={ocrData.doctorName || ''}
                  onChange={(e) => updateOcrData('doctorName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                <input
                  type="text"
                  value={ocrData.clinicName || ''}
                  onChange={(e) => updateOcrData('clinicName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Issued</label>
                <input
                  type="text"
                  value={ocrData.dateIssued || ''}
                  onChange={(e) => updateOcrData('dateIssued', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={ocrData.notes || ''}
                onChange={(e) => updateOcrData('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional notes..."
              />
            </div>

            {/* Medications */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-semibold text-gray-900">Medications</h4>
                <button
                  onClick={addMedication}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  + Add Medication
                </button>
              </div>

              {ocrData.medications && ocrData.medications.map((medication, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-medium text-gray-900">Medication {index + 1}</h5>
                    {ocrData.medications.length > 1 && (
                      <button
                        onClick={() => removeMedication(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                      <input
                        type="text"
                        value={medication.name || ''}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                      <input
                        type="text"
                        value={medication.dosage || ''}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                      <input
                        type="text"
                        value={medication.instructions || ''}
                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                      <input
                        type="text"
                        value={medication.medicalSchedules || ''}
                        onChange={(e) => updateMedication(index, 'medicalSchedules', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prescriptions History Section */}
        <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Prescriptions History</h3>
            <button
              onClick={fetchPrescriptions}
              disabled={isLoadingPrescriptions}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
            >
              {isLoadingPrescriptions ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {isLoadingPrescriptions ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Loading prescriptions...</span>
              </div>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No prescriptions found</p>
              <p className="text-gray-400 text-sm mt-2">Upload your first prescription to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Found {prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''}
              </p>
              
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  {/* Prescription Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        Dr. {prescription.doctorName}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">{prescription.clinicName}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Issued: {formatDate(prescription.dateIssued)}</span>
                        <span>•</span>
                        <span>Added: {formatDate(prescription.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {prescription.medications.length} medication{prescription.medications.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  {prescription.notes && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Notes: </span>
                        {prescription.notes}
                      </p>
                    </div>
                  )}

                  {/* Medications List */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900 mb-3">Medications:</h5>
                    {prescription.medications.map((medication, index) => (
                      <div key={medication.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">Medication</p>
                              <p className="text-sm text-gray-700">{medication.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">Dosage</p>
                              <p className="text-sm text-gray-700">{medication.dosage}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">Instructions</p>
                              <p className="text-sm text-gray-700">{medication.instructions}</p>
                            </div>
                          </div>
                          {medication.schedules && medication.schedules.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-900 mb-1">Schedules</p>
                              <div className="flex flex-wrap gap-2">
                                {medication.schedules.map((schedule, scheduleIndex) => (
                                  <span key={scheduleIndex} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                    {schedule}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Existing Medications List */}
        <div className="space-y-4">
          {/* Add medication list here */}
        </div>
       
      </div>
    </div>
  );
};

export default MedicationsComponent;
