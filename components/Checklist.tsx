import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Checklist({ checklist, taskId }: { checklist:any[]; taskId:string }) {
  const [items, setItems] = useState(checklist);

  async function toggle(idx:number) {
    const updated = items.map((it,i) => i===idx ? {...it, checked:!it.checked} : it);
    setItems(updated);
    await supabase.from("tasks").update({ checklist: updated }).eq("id", taskId);
  }
  return (
    <div>
      <h3>Checklist</h3>
      <ul>
        {items.map((item,i) => (
          <li key={i}>
            <input type="checkbox" checked={item.checked} onChange={()=>toggle(i)} />
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
