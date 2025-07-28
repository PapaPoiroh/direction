import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function TaskForm({ onTaskCreated } : { onTaskCreated: (task:any)=>void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    const { data, error } = await supabase.from("tasks").insert([{ title, description }]).select().single();
    if (data) onTaskCreated(data);
    setTitle(""); setDescription("");
  }

  return (
    <form onSubmit={handleSubmit} style={{display:"flex",gap:8,marginBottom:16}}>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Titre" required />
      <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" />
      <button type="submit">Ajouter</button>
    </form>
  );
}
