import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudUpload, FileText, LoaderCircle, FileSearch } from 'lucide-react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [analysisReady, setAnalysisReady] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage('');
    setAnalysisReady(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage('❌ Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setUploadMessage('');

      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const uploadedFilePath = result.filepath || result.path;
        localStorage.setItem('uploadedFilePath', uploadedFilePath);
        setUploadMessage('✅ File uploaded! Now click Analyze to continue.');
        setAnalysisReady(true);
      } else {
        setUploadMessage('❌ Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadMessage('❌ Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setUploadMessage('⏳ Analyzing document...');

    const uploadedFilePath = localStorage.getItem('uploadedFilePath');

    try {
      // Send a dummy question to trigger analysis
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Analyze this document',
          filepath: uploadedFilePath,
        }),
      });

      const result = await response.json();

      if (response.ok && result.answer) {
        setUploadMessage('✅ Analysis complete! Redirecting to chat...');
        setTimeout(() => navigate('/chat'), 1500);
      } else {
        setUploadMessage('❌ Analysis failed. Try again.');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setUploadMessage('❌ Analysis error. Try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white shadow-2xl rounded-3xl border border-gray-200">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">📄 Upload Document</h1>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition-colors">
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <CloudUpload className="w-12 h-12 text-blue-500 mb-2" />
          <p className="text-gray-600 mb-2">Click to select or drag and drop your file here</p>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {file && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-800">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="truncate max-w-xs">{file.name}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        className={`w-full mt-6 py-2 px-4 rounded-xl text-white font-semibold transition-all ${
          uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        disabled={uploading}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <LoaderCircle className="animate-spin w-5 h-5" />
            Uploading...
          </div>
        ) : (
          '🚀 Upload'
        )}
      </button>

      {analysisReady && (
        <button
          onClick={handleAnalyze}
          className={`w-full mt-4 py-2 px-4 rounded-xl text-white font-semibold transition-all ${
            analyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
          disabled={analyzing}
        >
          {analyzing ? (
            <div className="flex items-center justify-center gap-2">
              <LoaderCircle className="animate-spin w-5 h-5" />
              Analyzing...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <FileSearch className="w-5 h-5" />
              Analyze Document
            </div>
          )}
        </button>
      )}

      {uploadMessage && (
        <p className="mt-4 text-center text-sm font-medium text-gray-700">{uploadMessage}</p>
      )}
    </div>
  );
}