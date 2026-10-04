import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';

export interface FileUploadProps {
  file: File | null;
  existingUrl?: string;
  onChange: (file: File | null) => void;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  file,
  existingUrl,
  onChange,
  accept = 'image/jpeg,image/png,image/webp',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = file
    ? URL.createObjectURL(file)
    : existingUrl || null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileSelect}
        accept={accept}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative flex items-center gap-4 p-3 border border-slate-200 rounded-xl bg-slate-50">
          <div className="h-16 w-16 rounded-lg border border-slate-200 overflow-hidden bg-white shrink-0 flex items-center justify-center">
            <img src={previewUrl} alt="Company Profile" className="h-full w-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {file ? file.name : 'Current Profile Image'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG or WEBP (Max 5MB)</p>

            <div className="flex items-center gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs py-0"
                onClick={() => inputRef.current?.click()}
              >
                Change Image
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs py-0 text-red-600 hover:bg-red-50"
                onClick={handleRemove}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-[#2872A1] bg-slate-50 hover:bg-sky-50/30 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors"
        >
          <div className="rounded-full bg-slate-200/80 p-3 text-slate-600 mb-2">
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700">Click to upload company profile image</p>
          <p className="text-[11px] text-slate-400 mt-1">Supports JPG, PNG, WEBP up to 5MB</p>
        </div>
      )}
    </div>
  );
};
