import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Comments({ comments, taskId }: { comments: any[]; taskId: string }) {
  const [list, setList] = useState(comments);
  const [input, setInput] = useState("");

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    const updated = [...list, { text: input, date: new Date().toISOString() }];
    setList(updated);
    setInput("");
    await supabase.from("tasks").update({ comments: updated }).eq("id", taskId);
  }
  return (
    <div>
      <h3>Commentaires</h3>
      <ul>
        {list.map((c, i) => <li key={i}>{c.text} <em>({c.date})</em></li>)}
      </ul>
      <form onSubmit={addComment} style={{display:'flex',gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ajouter un commentaire" />
        <button type="submit">Valider</button>
      </form>
    </div>
  );
}
