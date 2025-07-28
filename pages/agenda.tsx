import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import CalendarView from "../components/CalendarView";

export default function Agenda() {
  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("tasks").select("*").then(({ data }) => setTasks(data || []));
  }, []);
  return (
    <div>
      <h1>Agenda</h1>
      <CalendarView tasks={tasks} />
    </div>
  );
}
