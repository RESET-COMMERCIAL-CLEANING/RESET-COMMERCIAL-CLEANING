'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileCheck, X, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { uploadSignedContract } from '@/lib/storage';

interface SignedContractUploadProps {
  contractId: string;
  onUploadComplete: (url: string) => void;
  currentSignedDocument?: string;
}

export default function SignedContractUpload({
  contractId,
  onUploadComplete,
  currentSignedDocument,
}: SignedContractUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(
    currentSignedDocument ? { name: 'Signed Contract', url: currentSignedDocument } : null
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setError('');
    setIsUploading(true);

    try {
      // Validate file type
      if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
        throw new Error('Please upload a PDF file');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Upload to Firebase Storage
      const url = await uploadSignedContract(contractId, file);

      setUploadedFile({
        name: file.name,
        url,
      });

      onUploadComplete(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-300 font-medium">Sign Externally</p>
          <p className="text-sm text-blue-200 mt-1">
            Download the contract PDF, sign it with your preferred method (e-signature, print & scan, etc.),
            and upload the signed copy below.
          </p>
        </div>
      </div>

      {uploadedFile ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border border-green-600/50 bg-green-900/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCheck className="w-6 h-6 text-green-400" />
              <div>
                <p className="font-semibold text-white">{uploadedFile.name}</p>
                <p className="text-sm text-gray-400">Signed contract uploaded</p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"
              aria-label="Remove file"
            >
              <X className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging
              ? 'border-reset-green/80 bg-reset-green/10'
              : 'border-gray-600/30 hover:border-reset-green/50'
          }`}
        >
          <Upload className="w-12 h-12 text-reset-green/50 mx-auto mb-3" />
          <p className="font-semibold text-white mb-2">Upload Signed Contract</p>
          <p className="text-sm text-gray-400 mb-4">
            Drag and drop your signed PDF here, or click to browse
          </p>

          <label className="inline-block px-4 py-2 bg-reset-green text-black rounded-lg font-bold hover:bg-reset-green/80 transition-colors cursor-pointer">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
            {isUploading ? 'Uploading...' : 'Select PDF'}
          </label>

          <p className="text-xs text-gray-500 mt-3">PDF files up to 10MB</p>
        </motion.div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-900/20 border border-red-600/50 rounded-lg p-3 flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-200">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
