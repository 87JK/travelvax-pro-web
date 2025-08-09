export default function Home() {
  return (
    <main style={{maxWidth: 800, margin: '40px auto', fontFamily:'system-ui'}}>
      <img src="/logo.svg" alt="TravelVax Pro" height={40} />
      <h1>TravelVax Pro</h1>
      <p>Clinician-only travel vaccination planner. CDC-based logic, patient PDF, and email. No backend servers required.</p>
      <p><a href="/plan">Create a plan →</a></p>
    </main>
  );
}