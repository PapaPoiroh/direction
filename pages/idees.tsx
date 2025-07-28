import { useState } from "react";

export default function Idees() {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [input, setInput] = useState("");
  return (
    <div>
      <h1>Boîte à idées</h1>
      <form onSubmit={e => {e.preventDefault(); setIdeas(i=>[input,...i]); setInput("");}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Nouvelle idée..." />
        <button type="submit">Ajouter</button>
      </form>
      <ul>
        {ideas.map((i,idx) => <li key={idx}>{i}</li>)}
      </ul>
    </div>
  );
}
