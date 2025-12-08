import { RawData } from '../types';

export const parseCSV = (content: string): RawData => {
  const lines = content.split(/\r\n|\n/);
  const rows = lines
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      // Handle quoted values containing commas
      const result = [];
      let current = '';
      let inQuote = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });

  if (rows.length === 0) {
    return { headers: [], rows: [] };
  }

  // Initially, treat everything as rows. Headers are determined by config.
  return {
    headers: rows[0], // Default guess
    rows: rows,
  };
};