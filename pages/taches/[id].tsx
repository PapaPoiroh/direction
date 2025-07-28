import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import TaskDetails from "../../components/TaskDetails";

export default function TaskPage() {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState<any>(null);

  useEffect(() => {
    if (id) {
      supabase.from("tasks").select("*").eq("id", id).single()
        .then(({ data }) => setTask(data));
    }
  }, [id]);

  if (!task) return <div>Chargement…</div>;
  return <TaskDetails task={task} />;
}
