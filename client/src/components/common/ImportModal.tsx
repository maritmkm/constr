import React, { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { parseImportFile, downloadSampleTemplate } from '@/lib/importUtils';
import { toast } from 'sonner';

interface ImportModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  moduleType: 'companies' | 'employees';
  requiredFields: { key: string; label: string }[];
  onImport: (data: T[]) => Promise<{ importedCount: number; skippedCount?: number }>;
  onSuccess: () => void;
}

export function ImportModal<T extends Record<string, any>>({
  isOpen,
  onClose,
  title,
  moduleType,
  requiredFields,
  onImport,
  onSuccess,
}: ImportModalProps<T>) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<T[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsParsing(true);
    try {
      const result = await parseImportFile<T>(selectedFile);
      if (result.errors.length > 0) {
        toast.error(result.errors.join(', '));
        setParsedData([]);
      } else {
        setParsedData(result.data);
        toast.success(`Loaded ${result.data.length} rows from file`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to read file');
      setFile(null);
      setParsedData([]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const getMissingFields = (row: Record<string, any>) => {
    return requiredFields.filter((rf) => !row[rf.key] || String(row[rf.key]).trim() === '');
  };

  const handleImportSubmit = async () => {
    if (parsedData.length === 0) {
      toast.error('No valid data to import.');
      return;
    }

    // Filter out rows missing core required fields
    const validRows = parsedData.filter((row) => getMissingFields(row).length === 0);

    if (validRows.length === 0) {
      toast.error('All rows are missing required fields. Please check your file.');
      return;
    }

    setIsUploading(true);
    try {
      const res = await onImport(validRows);
      toast.success(`Successfully imported ${res.importedCount} record(s)!`);
      onSuccess();
      handleCloseModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to import data');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseModal = () => {
    setFile(null);
    setParsedData([]);
    setIsParsing(false);
    setIsUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="text-xs text-slate-400">Import CSV or Excel (.xlsx) file into database</p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Download Sample Template section */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-medium text-slate-200">Need a sample format?</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Download a pre-formatted template with sample column headers and rows.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => downloadSampleTemplate(moduleType, 'csv')}
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" /> CSV Template
              </button>
              <button
                type="button"
                onClick={() => downloadSampleTemplate(moduleType, 'excel')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Excel Template
              </button>
            </div>
          </div>

          {/* File Upload Box */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,.xlsx,.xls"
            className="hidden"
          />

          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-slate-900/40 hover:bg-amber-500/[0.02] group"
            >
              <div className="p-4 rounded-full bg-slate-800 group-hover:scale-110 group-hover:bg-amber-500/10 text-slate-400 group-hover:text-amber-400 transition-all duration-200">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium text-slate-200 mt-3">
                Click to browse or drag & drop file here
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports CSV, XLSX, XLS formats</p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB • {parsedData.length} records parsed
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setParsedData([]);
                }}
                className="text-xs text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
              >
                Change File
              </button>
            </div>
          )}

          {/* Data Preview */}
          {isParsing ? (
            <div className="p-8 flex items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
              <span>Parsing file content...</span>
            </div>
          ) : parsedData.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Data Preview ({parsedData.length} rows)
                </h4>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Valid:{' '}
                    {parsedData.filter((r) => getMissingFields(r).length === 0).length}
                  </span>
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Missing Fields:{' '}
                    {parsedData.filter((r) => getMissingFields(r).length > 0).length}
                  </span>
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-x-auto max-h-60">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 font-medium uppercase text-[10px] tracking-wider sticky top-0">
                    <tr>
                      <th className="p-3">Status</th>
                      {Object.keys(parsedData[0] || {}).map((col) => (
                        <th key={col} className="p-3 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                    {parsedData.slice(0, 10).map((row, idx) => {
                      const missing = getMissingFields(row);
                      const isValid = missing.length === 0;
                      return (
                        <tr key={idx} className={isValid ? 'hover:bg-slate-800/30' : 'bg-rose-500/5'}>
                          <td className="p-3 whitespace-nowrap">
                            {isValid ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                                <CheckCircle className="w-3.5 h-3.5" /> Ready
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 text-rose-400 font-medium"
                                title={`Missing: ${missing.map((m) => m.label).join(', ')}`}
                              >
                                <AlertCircle className="w-3.5 h-3.5" /> Invalid
                              </span>
                            )}
                          </td>
                          {Object.keys(parsedData[0] || {}).map((col) => (
                            <td key={col} className="p-3 whitespace-nowrap max-w-xs truncate">
                              {String(row[col] ?? '')}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {parsedData.length > 10 && (
                <p className="text-[11px] text-slate-500 text-center">
                  Showing first 10 rows of {parsedData.length} records.
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-900/50">
          <button
            type="button"
            onClick={handleCloseModal}
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImportSubmit}
            disabled={parsedData.length === 0 || isUploading}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-semibold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/10"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> Import Records
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
