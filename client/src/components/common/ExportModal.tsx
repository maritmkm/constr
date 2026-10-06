import React, { useState } from 'react';
import { Download, X, FileSpreadsheet, FileText } from 'lucide-react';
import { ExportFormat } from '../../lib/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalRecords: number;
  onExport: (format: ExportFormat) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  title,
  totalRecords,
  onExport,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');

  if (!isOpen) return null;

  const handleDownload = () => {
    onExport(selectedFormat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="text-xs text-slate-400">Export {totalRecords} record(s)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selection */}
        <div className="p-6 space-y-4">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Select Export Format
          </label>

          <div className="grid grid-cols-2 gap-3">
            {/* CSV Option */}
            <div
              onClick={() => setSelectedFormat('csv')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                selectedFormat === 'csv'
                  ? 'border-sky-500 bg-sky-500/10 text-white shadow-lg shadow-sky-500/10'
                  : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <FileText className={`w-8 h-8 ${selectedFormat === 'csv' ? 'text-sky-400' : 'text-slate-500'}`} />
              <div className="text-center">
                <p className="text-sm font-semibold">CSV File</p>
                <p className="text-[10px] opacity-70 mt-0.5">Comma-Separated (.csv)</p>
              </div>
            </div>

            {/* Excel Option */}
            <div
              onClick={() => setSelectedFormat('excel')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                selectedFormat === 'excel'
                  ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-lg shadow-emerald-500/10'
                  : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className={`w-8 h-8 ${selectedFormat === 'excel' ? 'text-emerald-400' : 'text-slate-500'}`} />
              <div className="text-center">
                <p className="text-sm font-semibold">Excel File</p>
                <p className="text-[10px] opacity-70 mt-0.5">Spreadsheet (.xlsx)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 font-semibold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-sky-500/10"
          >
            <Download className="w-4 h-4" /> Download File
          </button>
        </div>
      </div>
    </div>
  );
};
