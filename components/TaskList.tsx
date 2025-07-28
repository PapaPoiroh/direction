import Link from "next/link";

export default function TaskList({ tasks, loading = false }: { tasks: any[]; loading?: boolean }) {
  if (loading) return <div>Chargement…</div>;
  if (!tasks.length) return <div>Aucune tâche.</div>;
  return (
    <ul>
      {tasks.map(t => (
        <li key={t.id}>
          <Link href={`/taches/${t.id}`}>{t.title}</Link>
          {t.status && <> – <b>{t.status}</b></>}
        </li>
      ))}
    </ul>
  );
}
