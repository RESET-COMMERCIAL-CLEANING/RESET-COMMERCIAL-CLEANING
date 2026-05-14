'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface UploadedComparison {
  title: string;
  before: string;
  after: string;
  completed: boolean;
}

export function BeforeAfterUpload({
  onUploadComplete,
}: {
  onUploadComplete: (comparison: UploadedComparison) => void;
}) {
  const [title, setTitle] = useState('');
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [beforePreview, setBeforePreview] = useState('');
  const [afterPreview, setAfterPreview] = useState('');

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'before' | 'after'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'before') {
        setBeforeFile(file);
        setBeforePreview(URL.createObjectURL(file));
      } else {
        setAfterFile(file);
        setAfterPreview(URL.createObjectURL(file));
      }
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!beforeFile || !afterFile) {
      setError('Please select both before and after images');
      return;
    }

    setLoading(true);

    try {
      const folderName = title.toLowerCase().replace(/\s+/g, '-');

      const [beforePath, afterPath] = await Promise.all([
        uploadFile(beforeFile, folderName),
        uploadFile(afterFile, folderName),
      ]);

      onUploadComplete({
        title,
        before: beforePath,
        after: afterPath,
        completed: false,
      });

      setTitle('');
      setBeforeFile(null);
      setAfterFile(null);
      setBeforePreview('');
      setAfterPreview('');
    } catch (err) {
      setError('Failed to upload images. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-gray-900 rounded-xl p-8 mb-16"
    >
      <h3 className="text-2xl font-bold text-white mb-6">Add New Comparison</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Comparison Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Office Conference Room"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-reset-green focus:outline-none"
          />
        </div>

        {/* Image Upload Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Before Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'before')}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={loading}
              />
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-reset-green transition-colors">
                {beforePreview ? (
                  <div className="space-y-2">
                    <img
                      src={beforePreview}
                      alt="Before preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-400">{beforeFile?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-6-8l-8 8m0 0l-8-8m8 8v20"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-sm text-gray-400">
                      Click to upload before image
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* After Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              After Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'after')}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={loading}
              />
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-reset-green transition-colors">
                {afterPreview ? (
                  <div className="space-y-2">
                    <img
                      src={afterPreview}
                      alt="After preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-400">{afterFile?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-6-8l-8 8m0 0l-8-8m8 8v20"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-sm text-gray-400">
                      Click to upload after image
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-reset-green text-black font-bold py-3 rounded-lg hover:bg-reset-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Uploading...' : 'Add Comparison'}
        </button>
      </form>
    </motion.div>
  );
}
