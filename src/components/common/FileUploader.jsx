import React, { useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

export const FileUploader = ({ onFilesSelected }) => {
  const [files, setFiles] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
      if (onFilesSelected) onFilesSelected(newFiles);
    }
  };

  const handleRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center hover:bg-slate-50 hover:border-indigo-300 transition-colors cursor-pointer"
      >
        <UploadCloud className="h-8 w-8 text-indigo-500 mb-2" />
        <p className="text-xs font-semibold text-slate-900">
          Click to upload or drag & drop files
        </p>
        <p className="mt-1 text-[11px] text-slate-400">PDF, PNG, JPG or DOCX (max. 10MB)</p>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2 text-xs">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                <span className="font-medium text-slate-800">{file.name}</span>
                <span className="text-[10px] text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button onClick={() => handleRemove(i)} className="text-slate-400 hover:text-rose-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
