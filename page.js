export default function SuccessPage() {
  return (
    <main className="container" style={{ maxWidth: 680 }}>
      <div className="card">
        <div className="badge">Payment complete</div>
        <h1 style={{ fontSize: 38, fontWeight: 900, marginTop: 16 }}>Thank you</h1>
        <p className="small" style={{ marginTop: 10 }}>
          Your payment succeeded. The next step is to collect business details and open the service workflow.
        </p>
      </div>
    </main>
  );
}
