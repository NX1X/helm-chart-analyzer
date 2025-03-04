import React, { useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

export default function FileUploadZone({ onFileUpload, isUploading }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const yamlFile = files.find(file => 
      file.name.endsWith('.yaml') || file.name.endsWith('.yml')
    );

    if (yamlFile) {
      onFileUpload(yamlFile);
    }
  }, [onFileUpload]);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith('.yaml') || file.name.endsWith('.yml'))) {
      onFileUpload(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg transition-colors ${
        dragActive ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-300"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 mb-4 rounded-full bg-blue-50 flex items-center justify-center">
          <Upload className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Upload Helm Chart</h3>
        <p className="text-sm text-gray-500 text-center mb-4">
          Drag and drop your Helm chart YAML file here
        </p>
        <input
          type="file"
          accept=".yaml,.yml"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button 
            disabled={isUploading}
            className="cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Select File
              </>
            )}
          </Button>
        </label>
        <p className="text-xs text-gray-400 mt-4">
          Supported formats: .yaml, .yml
        </p>
      </div>
    </div>
  );
}