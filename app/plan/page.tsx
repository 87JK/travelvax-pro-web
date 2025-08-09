'use client';
import { useState } from 'react';
import { jsPDF } from 'jspdf';

export default function PlanPage() {
  const [form, setForm] = useState({
    destinations: 'Thailand,Peru',
    departure_date: '2025-10-01',
    return_date: '2025-10-21',
    age: 35,
    pregnancy: false,
    immunosuppressed: false,
    activities: 'hiking,urban',
    accommodations: 'hotel',
    prior_vaccines: '{}',
    deidentified: true,
    patient_initials: '',
    birth_year_range: ''
  });
  const [result, setResult] = useState<any>(null);
  const [email, setEmail] = useState<string>('');

  const submit = async () => {
    const payload = {
      ...form,
      destinations: form.destinations.split(',').map(s => s.trim()).filter(Boolean),
      activities: form.activities.split(',').map(s => s.trim()).filter(Boolean),
      accommodations: form.accommodations.split(',').map(s => s.trim()).filter(Boolean),
      prior_vaccines: JSON.parse(form.prior_vaccines || '{}')
    };
    const r = await fetch('/api/plan', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const data = await r.json();
    setResult(data);
  };

  const downloadPdf = () => {
    if (!result) return;
    const doc = new jsPDF();
    let y = 10;
    const add = (t:string)=>{ doc.text(t,10,y); y+=8; };
    doc.setFontSize(14); add('TravelVax Pro — Travel Vaccination Plan');
    doc.setFontSize(10); add(`Last reviewed: ${result.last_reviewed}`);
    y+=4; doc.setFontSize(12); add('Recommendations:');
    doc.setFontSize(10);
    (result.recommendations||[]).forEach((r:any)=>{ add(`• ${r.vaccine} (${r.category}) — ${r.rationale}`); if(r.schedule) add(`   ${r.schedule}`); });
    if(result.malaria?.indicated){ y+=4; doc.setFontSize(12); add('Malaria:'); doc.setFontSize(10);
      if(result.malaria.regimen) add(result.malaria.regimen);
      if(result.malaria.schedule) add(result.malaria.schedule);
      if(result.malaria.notes) add(result.malaria.notes);
    }
    y+=4; doc.setFontSize(12); add('Sources:');
    doc.setFontSize(8); (result.sources||[]).forEach((s:string)=>add(`- ${s}`));
    doc.save('travelvax-plan.pdf');
  };

  const sendEmail = async () => {
    if (!result || !email) return;
    const r = await fetch('/api/send-plan', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ to: email, plan: result }) });
    alert(r.ok ? 'Email sent' : 'Email failed');
  };

  return (
    <main style={{maxWidth: 920, margin:'40px auto', fontFamily:'system-ui'}}>
      <h1>Create a plan</h1>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <label>Destinations (comma-separated)<br/><input value={form.destinations} onChange={e=>setForm({...form, destinations:e.target.value})} style={{width:'100%'}}/></label>
        <label>Departure date<br/><input type="date" value={form.departure_date} onChange={e=>setForm({...form, departure_date:e.target.value})} /></label>
        <label>Return date<br/><input type="date" value={form.return_date} onChange={e=>setForm({...form, return_date:e.target.value})} /></label>
        <label>Age<br/><input type="number" value={form.age} onChange={e=>setForm({...form, age:Number(e.target.value)})} /></label>
        <label>Activities (comma-separated)<br/><input value={form.activities} onChange={e=>setForm({...form, activities:e.target.value})} /></label>
        <label>Accommodations (comma-separated)<br/><input value={form.accommodations} onChange={e=>setForm({...form, accommodations:e.target.value})} /></label>
        <label>Prior vaccines (JSON)<br/><input value={form.prior_vaccines} onChange={e=>setForm({...form, prior_vaccines:e.target.value})} /></label>
        <label>De-identified<br/><input type="checkbox" checked={form.deidentified} onChange={e=>setForm({...form, deidentified:e.target.checked})} /></label>
        <label>Patient initials (optional)<br/><input value={form.patient_initials} onChange={e=>setForm({...form, patient_initials:e.target.value})} /></label>
        <label>Birth year range (optional)<br/><input value={form.birth_year_range} onChange={e=>setForm({...form, birth_year_range:e.target.value})} placeholder="e.g., 1985-1989" /></label>
      </div>
      <div style={{marginTop:16}}><button onClick={submit}>Generate</button></div>
      {result && (<section style={{marginTop:28}}>
        <h2>Plan</h2>
        <pre style={{background:'#f5f5f5', padding:16, overflow:'auto'}}>{JSON.stringify(result, null, 2)}</pre>
        <div style={{display:'flex', gap:12}}>
          <button onClick={downloadPdf}>Download PDF</button>
          <input placeholder="patient@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          <button onClick={sendEmail}>Email plan</button>
        </div>
      </section>)}
    </main>
  );
}