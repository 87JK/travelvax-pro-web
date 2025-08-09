# TravelVax Pro (Serverless, no Python)
Pure Next.js (TypeScript) app with serverless API routes. Generates clinician-grade travel vaccination plans using CDC guidance. Emails plans via Postmark. Optional de-identified storage on Supabase. Deploy on Vercel. No Python required.

## Structure
- `app/` — App Router pages + API routes
- `lib/` — CDC fetchers, rules engine, PDF helper

## Quick start
1) `cp .env.example .env` and set `POSTMARK_*` (and Supabase if you want storage).
2) `npm install`
3) `npm run dev`
4) Open http://localhost:3000

## Deploy
- Push to GitHub → Import in Vercel → Set env vars:
  - `POSTMARK_API_TOKEN`, `POSTMARK_FROM`
  - Optional: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_TABLE`

## Notes
- CDC integration is stubbed with a normaliser in `lib/cdc.ts`. Replace `TODO` parts to pull Content Syndication feeds and parse Destinations pages.
- PDF export is **client-side** using jsPDF (no headless Chrome needed on Vercel).

## Legal
For clinical use, validate outputs against current guidelines and maintain your own governance.
