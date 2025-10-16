import type { Request, Response } from 'express';
import archiver from 'archiver';
import PDFDocument from 'pdfkit';
function todayISO() { return new Date().toISOString().slice(0,10); }
function buildPdfBuffer(n) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.fontSize(16).text(`${n.comunidad}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${todayISO()}`);
    doc.moveDown();
    doc.fontSize(14).text(`Aviso de cobranza — Unidad ${n.unidad}`, { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Estimad@ ${n.destinatario},`);
    doc.moveDown();
    doc.text(`Saldo pendiente: CLP ${Number(n.monto).toLocaleString('es-CL')} por gastos comunes.`);
    doc.moveDown();
    doc.text('Regularice en 5 días hábiles o contáctenos para acuerdo de pago.');
    doc.moveDown();
    doc.text('Atentamente,');
    doc.text(`${n.comunidad}`);
    doc.end();
  });
}
export async function generateBatchNoticesZip(req, res) {
  const { items } = req.body ?? {};
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: 'Se requiere `items` (array de avisos).' });
  }
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=avisos_${todayISO()}.zip`);
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.on('error', err => { throw err; });
  archive.pipe(res);
  for (const it of items) {
    const buf = await buildPdfBuffer(it);
    archive.append(buf, { name: `aviso_${it.unidad}.pdf` });
  }
  await archive.finalize();
}
