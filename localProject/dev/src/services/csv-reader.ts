/**
 * Service pour lire les fichiers CSV
 */

export class CsvReader {
  /**
   * Parse un fichier CSV en tableau d'objets
   */
  static parseCsv(csvText: string): Record<string, string>[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    // Gérer le BOM UTF-8 si présent
    const firstLine = lines[0].replace(/^\uFEFF/, '');
    const headers = this.parseCsvLine(firstLine);

    const data: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);
      if (values.length === 0) continue;

      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }

    return data;
  }

  /**
   * Parse une ligne CSV en tenant compte des guillemets
   */
  private static parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  /**
   * Charge un fichier CSV depuis une URL
   */
  static async loadCsv(url: string): Promise<Record<string, string>[]> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load CSV: ${response.statusText}`);
      }
      const text = await response.text();
      return this.parseCsv(text);
    } catch (error) {
      console.error(`Error loading CSV from ${url}:`, error);
      return [];
    }
  }
}

