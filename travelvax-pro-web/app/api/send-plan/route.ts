import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { to, plan } = await req.json();
  const from = process.env.POSTMARK_FROM || 'clinic@example.com';
  const token = process.env.POSTMARK_API_TOKEN || '';
  if (!token) {
    return NextResponse.json({ error: 'POSTMARK_API_TOKEN not set' }, { status: 500 });
  }
  const html = `<h1>TravelVax Pro Plan</h1><pre>${JSON.stringify(plan, null, 2)}</pre>`;
  const r = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': token
    },
    body: JSON.stringify({
      From: from, To: to, Subject: 'Your Travel Vaccination Plan', HtmlBody: html, MessageStream: 'outbound'
    })
  });
  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json({ error: text }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
