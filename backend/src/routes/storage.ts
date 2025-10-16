import type { Request, Response } from 'express';
import { pool } from '../services/db.js';
export async function savePayments(req: Request, res: Response) {
  if (!pool) return res.status(500).json({ error: 'DB no configurada (DATABASE_URL no definido).' });
  const { rows, assignments } = req.body ?? {};
  if (!Array.isArray(rows)) return res.status(400).json({ error: 'rows debe ser array' });
  const client = await pool.connect();
  try {
    await client.query('begin');
    for (const a of (assignments || [])) {
      if (a.unidad) {
        await client.query('insert into units(code) values($1) on conflict (code) do nothing', [a.unidad]);
      }
    }
    for (let i=0;i<rows.length;i++) {
      const r = rows[i];
      const unit = (assignments || []).find((x:any)=>x.rowIndex===i)?.unidad || null;
      await client.query(
        'insert into payments(date, detail, amount, unit_code) values($1,$2,$3,$4)',
        [r.fecha || null, r.detalle || null, r.monto || 0, unit]
      );
    }
    await client.query('commit');
    res.json({ ok: true });
  } catch (e:any) {
    await client.query('rollback');
    res.status(500).json({ error: 'No se pudieron guardar pagos', detail: String(e) });
  } finally {
    client.release();
  }
}
export async function listPayments(_req: Request, res: Response) {
  if (!pool) return res.status(500).json({ error: 'DB no configurada' });
  const q = await pool.query('select id, date, detail, amount, unit_code from payments order by id desc limit 100');
  res.json({ rows: q.rows });
}
