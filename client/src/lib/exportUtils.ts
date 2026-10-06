import * as XLSX from 'xlsx';

export type ExportFormat = 'csv' | 'excel';

export function exportDataToFile<T extends Record<string, any>>(
  data: T[],
  filename: string,
  format: ExportFormat,
  columnHeaders?: { [K in keyof T]?: string }
) {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  // Format array with customized column headers if provided
  const formattedData = data.map((row) => {
    if (!columnHeaders) return row;
    const newRow: Record<string, any> = {};
    for (const key of Object.keys(row)) {
      const headerLabel = columnHeaders[key] || key;
      newRow[headerLabel] = row[key];
    }
    return newRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  if (format === 'csv') {
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }
}
