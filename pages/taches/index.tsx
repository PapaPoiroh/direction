import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import TaskForm from "../../components/TaskForm";

export default function Taches() {
  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("tasks").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setTasks(data || []));
  }, []);
  return (
    <div>
      <h1>Toutes les tâches</h1>
      <TaskForm onTaskCreated={task => setTasks([task, ...tasks])} />
      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            <Link href={`/taches/${t.id}`}>{t.title}</Link>
            {t.status && <> – <b>{t.status}</b></>}
          </li>
        ))}
      </ul>
    </div>
  );
}
