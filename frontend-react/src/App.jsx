import React, { useState } from 'react'
const BE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
export default function App(){
  const [csv, setCsv] = useState('')
  const [mapping, setMapping] = useState('{\n  "JUAN PEREZ":"Depto 102",\n  "MARTA LOPEZ":"Depto 305"\n}')
  const [out, setOut] = useState('')
  const [unidad, setUnidad] = useState('Depto 102')
  const [destinatario, setDest] = useState('JUAN PEREZ')
  const [monto, setMonto] = useState(50000)
  const [comunidad, setCom] = useState('Condominio Salitrera María Elena')
  const process = async () => {
    let map = {}; try { map = JSON.parse(mapping) } catch { alert('Mapping inválido'); return }
    const res = await fetch(`${BE}/api/payments/import`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ csv, mapping: map }) })
    setOut(JSON.stringify(await res.json(), null, 2))
  }
  const saveToDb = async () => {
    try{
      const data = JSON.parse(out)
      const res = await fetch(`${BE}/api/payments/save`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ rows: data.rows, assignments: data.assignments }) })
      alert('Guardado: ' + JSON.stringify(await res.json()))
    }catch{ alert('Procesa primero') }
  }
  const genDoc = async (fmt='pdf') => {
    const res = await fetch(`${BE}/api/letters/notice.${fmt}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ unidad, destinatario, monto, comunidad }) })
    const blob = await res.blob(); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `aviso_cobranza_${unidad}.${fmt}`; a.click();
  }
  return (
    <div style={{padding:'1rem', fontFamily:'system-ui'}}>
      <h1>CondoAI — UI</h1>
      <textarea style={{width:'100%', height:120}} value={csv} onChange={e=>setCsv(e.target.value)} placeholder='Pega tu CSV aquí' />
      <textarea style={{width:'100%', height:120}} value={mapping} onChange={e=>setMapping(e.target.value)} />
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={process}>Procesar</button>
        <button onClick={saveToDb}>Guardar DB</button>
      </div>
      <pre style={{background:'#f6f8fa', padding:12, marginTop:8}}>{out}</pre>
      <h3>Generar carta</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8}}>
        <input value={unidad} onChange={e=>setUnidad(e.target.value)} />
        <input value={destinatario} onChange={e=>setDest(e.target.value)} />
        <input type='number' value={monto} onChange={e=>setMonto(Number(e.target.value))} />
        <input value={comunidad} onChange={e=>setCom(e.target.value)} />
      </div>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={()=>genDoc('pdf')}>Descargar PDF</button>
        <button onClick={()=>genDoc('docx')}>Descargar DOCX</button>
      </div>
    </div>
  )
}
