import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function GED() {
  const [files, setFiles] = useState<any[]>([]);
  useEffect(() => {
    // à adapter selon stockage Supabase
    supabase.storage.from("attachments").list("")
      .then(({ data }) => setFiles(data || []));
  }, []);
  return (
    <div>
      <h1>GED – Fichiers</h1>
      <ul>
        {files.map(f => (
          <li key={f.name}>{f.name}</li>
        ))}
      </ul>
    </div>
  );
}
