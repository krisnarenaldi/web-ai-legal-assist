import { parseRisks } from './parseRisks.js';
import path from 'path';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  // Use process.cwd() to resolve from project root
  const jsonPath = path.resolve(process.cwd(), 'static/clauses_risks.json');
  const parsed = parseRisks(jsonPath);
  return { parsed };
}
