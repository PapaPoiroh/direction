import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import TaskList from "../components/TaskList";
import CalendarView from "../components/CalendarView";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("tasks")
      .select("*")
      .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
      .order("due_date", { ascending: true })
      .then(({ data }) => setTasks(data || []));
  }, [user]);

  return (
    <div>
      <h1>Tableau de bord</h1>
      <h2>Vue agenda</h2>
      <CalendarView tasks={tasks} />
      <h2>Mes tâches</h2>
      <TaskList tasks={tasks} />
    </div>
  );
}
