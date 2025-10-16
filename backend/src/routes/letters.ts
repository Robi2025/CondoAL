import type { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';
function todayISO() { return new Date().toISOString().slice(0,10); }
export async function generateNoticePdf(req: Request, res: Response) {
  const { unidad, destinatario, monto, comunidad } = req.body ?? {};
  if (!unidad || !destinatario || !monto || !comunidad) {
    return res.status(400).json({ error: 'Faltan campos: unidad, destinatario, monto, comunidad' });
  }
  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];
  doc.on('data', (c) => chunks.push(c));
  doc.on('end', () => {
    const out = Buffer.concat(chunks);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=aviso_cobranza_${unidad}.pdf`);
    res.send(out);
  });
  doc.fontSize(16).text(`${comunidad}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Fecha: ${todayISO()}`);
  doc.moveDown();
  doc.fontSize(14).text(`Aviso de cobranza — Unidad ${unidad}`, { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`Estimad@ ${destinatario},`);
  doc.moveDown();
  doc.text(`Informamos que registra un saldo pendiente por CLP ${Number(monto).toLocaleString('es-CL')} correspondiente a gastos comunes.`);
  doc.moveDown();
  doc.text('Le solicitamos regularizar dentro de 5 días hábiles o contactarnos para un acuerdo de pago.');
  doc.moveDown();
  doc.text('Atentamente,');
  doc.text(`${comunidad}`);
  doc.end();
}
export async function generateNoticeDocx(req: Request, res: Response) {
  const { unidad, destinatario, monto, comunidad } = req.body ?? {};
  if (!unidad || !destinatario || !monto || !comunidad) {
    return res.status(400).json({ error: 'Faltan campos: unidad, destinatario, monto, comunidad' });
  }
  const children: Paragraph[] = [
    new Paragraph({ text: `${comunidad}`, heading: HeadingLevel.HEADING_1 }),
    new Paragraph({ text: `Fecha: ${todayISO()}` }),
    new Paragraph({ text: '' }),
    new Paragraph({ text: `Aviso de cobranza — Unidad ${unidad}`, heading: HeadingLevel.HEADING_2 }),
    new Paragraph({ text: '' }),
    new Paragraph({ children: [ new TextRun({ text: `Estimad@ ${destinatario},` }) ] }),
    new Paragraph({ text: `Informamos que registra un saldo pendiente por CLP ${Number(monto).toLocaleString('es-CL')} correspondiente a gastos comunes.` }),
    new Paragraph({ text: `Le solicitamos regularizar dentro de 5 días hábiles o contactarnos para un acuerdo de pago.` }),
    new Paragraph({ text: '' }),
    new Paragraph({ text: 'Atentamente,' }),
    new Paragraph({ text: `${comunidad}` }),
  ];
  const doc = new Document({ sections: [{ children }] });
  const b = await Packer.toBuffer(doc);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename=aviso_cobranza_${unidad}.docx`);
  res.send(b);
}
