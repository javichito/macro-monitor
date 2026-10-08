/**
 * Data Export & Reproducibility Utility
 * 
 * Provides RFC 4180 compliant CSV serialization, formatted JSON structuring,
 * and client-side streaming downloads for macroeconomic datasets.
 */

export interface DatasetColumn<T = any> {
  key: string;
  label: string;
  format?: (value: any, row: T) => string | number | null | undefined;
}

export interface DatasetMetadata {
  title: string;
  source?: string;
  description?: string;
  unit?: string;
  perspective?: string;
  year?: number | string;
  country?: string;
  scenario?: string;
  exportedAt?: string;
  methodology?: string;
  license?: string;
  [key: string]: any;
}

export interface ExportDatasetOptions<T = any> {
  filename: string;
  title: string;
  data: T[];
  columns?: DatasetColumn<T>[];
  metadata?: Partial<DatasetMetadata>;
}

/*
 * Sanitizes arbitrary titles into clean, filesystem-safe slugs
 * so generated download filenames conform to OS path conventions.
 */
export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'dataset';
}

/*
 * Escapes individual cell values according to RFC 4180 specification:
 * Strings containing quotes, commas, or newlines must be double-quoted,
 * and internal quotation marks must be escaped as double double-quotes.
 */
function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) {
    return '';
  }
  const str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/*
 * Converts an array of objects to an RFC 4180 compliant CSV string.
 * Prepends a UTF-8 Byte Order Mark (\uFEFF) so Microsoft Excel, LibreOffice,
 * and Google Sheets reliably decode unicode currency symbols and international names.
 */
export function generateCsv<T = any>(
  data: T[],
  columns?: DatasetColumn<T>[],
  metadata?: Partial<DatasetMetadata>
): string {
  if (!data || data.length === 0) {
    return '\uFEFF';
  }

  // Derive columns dynamically from record keys if explicit column mapping is omitted
  const resolvedColumns: DatasetColumn<T>[] =
    columns && columns.length > 0
      ? columns
      : Object.keys(data[0] as Record<string, any>).map((key) => ({
          key,
          label: key,
        }));

  const headerRow = resolvedColumns.map((col) => escapeCsvValue(col.label)).join(',');

  const dataRows = data.map((row) => {
    return resolvedColumns
      .map((col) => {
        const rawValue = (row as any)[col.key];
        const value = col.format ? col.format(rawValue, row) : rawValue;
        return escapeCsvValue(value);
      })
      .join(',');
  });

  // UTF-8 BOM ensures instant compatibility with Excel across Windows and macOS
  return '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
}

/*
 * Generates structured JSON bundled with citation metadata, timestamps,
 * and units to provide academic researchers and journalists with provenance.
 */
export function generateJson<T = any>(
  data: T[],
  metadata?: Partial<DatasetMetadata>
): string {
  const payload = {
    metadata: {
      title: metadata?.title || 'Macroeconomic Dataset',
      description: metadata?.description,
      source: metadata?.source || 'Macro Monitor (Synthesized from BIS, IMF, World Bank, Federal Reserve)',
      unit: metadata?.unit,
      perspective: metadata?.perspective,
      year: metadata?.year,
      country: metadata?.country,
      scenario: metadata?.scenario,
      exportedAt: metadata?.exportedAt || new Date().toISOString(),
      license: metadata?.license || 'Open Data Commons / CC BY 4.0',
      recordCount: data.length,
      ...metadata,
    },
    data,
  };

  return JSON.stringify(payload, null, 2);
}

/*
 * Dispatches an in-browser streaming download via Blob and temporary object URL
 * to avoid round-trip server generation costs and preserve user privacy offline.
 */
export function triggerDownload(content: string, filename: string, mimeType: string): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  /*
   * Revoke after slight delay to allow asynchronous mobile browsers
   * sufficient execution time to bind the file blob stream before disposal.
   */
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

/*
 * One-click helper for CSV export
 */
export function downloadDatasetCsv<T = any>(options: ExportDatasetOptions<T>): void {
  const csv = generateCsv(options.data, options.columns, options.metadata);
  const slug = sanitizeFilename(options.filename);
  triggerDownload(csv, `${slug}.csv`, 'text/csv');
}

/*
 * One-click helper for JSON export
 */
export function downloadDatasetJson<T = any>(options: ExportDatasetOptions<T>): void {
  const json = generateJson(options.data, {
    title: options.title,
    ...options.metadata,
  });
  const slug = sanitizeFilename(options.filename);
  triggerDownload(json, `${slug}.json`, 'application/json');
}
