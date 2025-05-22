import fs from 'fs';

/**
 * Parses the clauses_risks.json file and transforms the data for rendering.
 * - Each top-level key is preserved.
 * - For values containing numbered lists (\n1, \n2, ...), splits into an array.
 * - For 'risks', each risk question/answer is processed similarly.
 * @param {string} jsonPath - Path to the JSON file.
 * @returns {object} Parsed and transformed data.
 */
export function parseRisks(jsonPath) {
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(raw);
  const result = {};

  // Parse 'clauses' array
  if (Array.isArray(data.clauses)) {
    result.clauses = data.clauses.map(item => ({
      title: item.Klausa,
      content: splitNumberedList(item.Isi)
    }));
  }

  // Parse 'risks' object
  if (typeof data.risks === 'object') {
    result.risks = Object.entries(data.risks).map(([riskTitle, riskValue]) => ({
      title: riskTitle,
      content: splitNumberedList(riskValue)
    }));
  }

  return result;
}

function splitNumberedList(text) {
  if (typeof text !== 'string') return text;
  
  // Check if the text contains numbered items
  if (text.match(/\n\d+\./) || text.match(/\n\d+[^\.]/) || text.match(/^\d+\./)) {
    // First, handle the case where the text starts with a number
    let items = [];
    
    // Split on '\n1.', '\n2.', etc., but keep the first part
    const numberedWithDot = text.split(/\n(?=\d+\.)/g);
    
    // If we found numbered items with dots
    if (numberedWithDot.length > 1) {
      // Format each item for proper rendering
      return numberedWithDot.map(item => {
        item = item.trim();
        // If item starts with a number and period, format it for proper indentation
        if (/^\d+\./.test(item)) {
          const [number, ...rest] = item.split('.');
          return `${number}.   ${rest.join('.').trim()}`;
        }
        return item;
      });
    }
    
    // Try '\n1', '\n2', etc. (without the dot)
    const simpleNum = text.split(/\n(?=\d+[^\.])/g);
    if (simpleNum.length > 1) {
      // Format each item for proper rendering
      return simpleNum.map(item => {
        item = item.trim();
        // If item starts with just a number, format it as a numbered list item
        if (/^\d+[^\.]/.test(item)) {
          const match = item.match(/^(\d+)(.*)/);
          if (match) {
            const [_, number, content] = match;
            return `${number}.   ${content.trim()}`;
          }
        }
        return item;
      });
    }
  }
  
  return text;
}
