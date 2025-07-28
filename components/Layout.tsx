import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav style={{padding: '1rem', borderBottom: '1px solid #eee', marginBottom: 20}}>
        <Link href="/dashboard">Dashboard</Link> |{' '}
        <Link href="/taches">Tâches</Link> |{' '}
        <Link href="/agenda">Agenda</Link> |{' '}
        <Link href="/utilisateurs">Utilisateurs</Link> |{' '}
        <Link href="/ged">GED</Link> |{' '}
        <Link href="/idees">Idées</Link> |{' '}
        <Link href="/login">Se connecter</Link>
      </nav>
      <main style={{maxWidth: 900, margin: '0 auto'}}>{children}</main>
    </div>
  );
}
