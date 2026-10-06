import * as XLSX from 'xlsx';

export interface ParsedImportResult<T> {
  data: T[];
  errors: string[];
}

export function parseImportFile<T>(file: File): Promise<ParsedImportResult<T>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = XLSX.read(buffer, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Parse to JSON array of objects
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          return resolve({ data: [], errors: ['File contains no rows or data.'] });
        }

        // Clean keys (trim whitespace and standardise case mappings if necessary)
        const cleanData = rawJson.map((row) => {
          const cleanRow: Record<string, any> = {};
          Object.keys(row).forEach((key) => {
            const trimmedKey = key.trim();
            cleanRow[trimmedKey] = typeof row[key] === 'string' ? row[key].trim() : row[key];
          });
          return cleanRow as T;
        });

        resolve({ data: cleanData, errors: [] });
      } catch (err: any) {
        reject(new Error(`Failed to parse file: ${err.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };

    reader.readAsBinaryString(file);
  });
}

export function downloadSampleTemplate(type: 'companies' | 'employees', format: 'csv' | 'excel' = 'csv') {
  let sampleRows: Record<string, string>[] = [];
  let filename = '';

  if (type === 'companies') {
    filename = 'Company_Import_Template';
    sampleRows = [
      {
        companyName: 'Apex Infrastructures',
        companyType: 'Commercial Construction',
        locationName: 'Trichy',
        ownerName: 'Ramesh Kumar',
        phoneNumber: '+91 98765 43210',
        alternativePhoneNumber: '+91 98765 43211',
        address: '12, M.G. Road, Trichy',
      },
      {
        companyName: 'Vanguard Builders',
        companyType: 'Residential',
        locationName: 'Madurai',
        ownerName: 'Suresh Babu',
        phoneNumber: '+91 91234 56789',
        alternativePhoneNumber: '',
        address: '45, West Tower Street, Madurai',
      },
    ];
  } else {
    filename = 'Employee_Import_Template';
    sampleRows = [
      {
        name: 'Karthik Subramanian',
        phoneNumber: '+91 98400 12345',
        jobTypeName: 'Mason',
        locationName: 'Chennai',
        status: 'ACTIVE',
        address: '15 Anna Nagar, Chennai',
        alternativePhoneNumber: '+91 98400 12346',
      },
      {
        name: 'Murugan Periasamy',
        phoneNumber: '+91 97890 54321',
        jobTypeName: 'Electrician',
        locationName: 'Coimbatore',
        status: 'ACTIVE',
        address: '88 Crosscut Road, Coimbatore',
        alternativePhoneNumber: '',
      },
    ];
  }

  const worksheet = XLSX.utils.json_to_sheet(sampleRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

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
