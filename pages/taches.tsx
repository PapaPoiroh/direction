import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Task = {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  status?: string;
  created_by?: string;
  assigned_to?: string;
  checklist?: any;
  attachments?: any;
  comments?: any;
  created_at?: string;
};

export default function Taches() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Charger les tâches
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setTasks(data as Task[]);
    };
    fetchTasks();
  }, []);

  // Ajouter une tâche
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, description }])
      .select()
      .single();
    if (!error && data) setTasks((prev) => [data as Task, ...prev]);
    setTitle('');
    setDescription('');
  };

  // Supprimer une tâche
  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      <h1>Gestion des tâches</h1>
      <form onSubmit={addTask} style={{display: 'flex', gap: 8, marginBottom: 16, flexDirection: 'column', maxWidth: 400}}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Titre"
          required
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit" disabled={!title.trim()}>Ajouter</button>
      </form>
      <ul>
        {tasks.map((t) => (
          <li key={t.id} style={{marginBottom: 12}}>
            <strong>{t.title}</strong>
            {t.description && <div>{t.description}</div>}
            <button onClick={() => deleteTask(t.id)} style={{color: 'red'}}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
