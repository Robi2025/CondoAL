import type { Request, Response } from 'express';
import { parse } from 'csv-parse/sync';

type Row = { fecha: string; detalle: string; monto: number };
function normalizeName(detalle: string): string | null {
  const m = detalle.match(/transferencia\s+([^,\n]+)|dep[oó]sito\s+([^,\n]+)/i);
  if (!m) return null;
  const name = (m[1] || m[2] || '').trim();
  return name.replace(/\s+/g, ' ').toUpperCase();
}
export async function importPayments(req: Request, res: Response) {
  const { csv, mapping } = req.body ?? {};
  if (!csv || typeof csv !== 'string') {
    return res.status(400).json({ error: 'Falta campo `csv` como texto.' });
  }
  const map: Record<string, string> = mapping && typeof mapping === 'object' ? mapping : {};
  let records: any[];
  try {
    records = parse(csv, { columns: true, skip_empty_lines: true, trim: true });
  } catch (e) {
    return res.status(400).json({ error: 'CSV inválido', detail: String(e) });
  }
  const rows: Row[] = records.map(r => ({
    fecha: r.Fecha || r.fecha || r.DATE || '',
    detalle: r.Detalle || r.detalle || r.DESCRIPCION || r.Description || '',
    monto: Number((r.Monto || r.monto || r.AMOUNT || '0').toString().replace(/[\$\.]/g, '').replace(',', '.'))
  }));
  const assignments: any[] = [];
  const unmatched: number[] = [];
  rows.forEach((row, idx) => {
    const probable = normalizeName(row.detalle);
    if (probable && map[probable]) {
      assignments.push({ rowIndex: idx, destinatario: probable, unidad: map[probable] });
    } else {
      unmatched.push(idx);
    }
  });
  res.json({ rows, assignments, unmatched });
}
