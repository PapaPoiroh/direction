import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';

const menuItems = [
  { label: 'Accueil', href: '/' },
  { label: 'Tableau de bord', href: '/dashboard' },
  { label: 'Tâches', href: '/taches' },
  { label: 'GED', href: '/ged' },
  { label: 'Idées', href: '/idees' },
  { label: 'Agenda', href: '/agenda' },
];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-root">
      <aside className="sidebar">
        <div className="logo-container">
          <Image
            src="/logo-stjean.png"
            alt="Logo St Jean"
            width={60}
            height={60}
            className="logo-img"
            priority
          />
          <span className="logo-title">Direction St Jean</span>
        </div>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
