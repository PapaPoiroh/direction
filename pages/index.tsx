import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Bienvenue sur la plateforme Direction</h1>
      <nav>
        <ul>
          <li><Link href="/dashboard">Tableau de bord</Link></li>
          <li><Link href="/taches">Tâches</Link></li>
          <li><Link href="/ged">GED</Link></li>
          <li><Link href="/idees">Idées</Link></li>
          <li><Link href="/agenda">Agenda</Link></li>
        </ul>
      </nav>
    </main>
  );
}