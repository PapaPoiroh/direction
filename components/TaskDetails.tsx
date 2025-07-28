import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Checklist from "./Checklist";
import Comments from "./Comments";
import AttachmentUploader from "./AttachmentUploader";

export default function TaskDetails({ task }: { task: any }) {
  const [status, setStatus] = useState(task.status || "");
  const [assigned, setAssigned] = useState(task.assigned_to || "");

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStatus(e.target.value);
    await supabase.from("tasks").update({ status: e.target.value }).eq("id", task.id);
  }
  async function handleAssignChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setAssigned(e.target.value);
    await supabase.from("tasks").update({ assigned_to: e.target.value }).eq("id", task.id);
  }

  // TODO: Fetch users for assignation
  const users = [{ id: "1", email: "user@example.com" }];

  return (
    <div>
      <h1>{task.title}</h1>
      <div>Description : {task.description}</div>
      <div>
        Statut :
        <select value={status} onChange={handleStatusChange}>
          <option value="">Choisir</option>
          <option value="todo">À faire</option>
          <option value="doing">En cours</option>
          <option value="done">Terminé</option>
        </select>
      </div>
      <div>
        Assigné à :
        <select value={assigned} onChange={handleAssignChange}>
          <option value="">Aucun</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.email}</option>)}
        </select>
      </div>
      <Checklist checklist={task.checklist || []} taskId={task.id} />
      <AttachmentUploader taskId={task.id} />
      <Comments comments={task.comments || []} taskId={task.id} />
    </div>
  );
}
