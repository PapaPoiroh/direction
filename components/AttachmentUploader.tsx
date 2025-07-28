import { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AttachmentUploader({ taskId }: { taskId: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<any[]>([]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await supabase.storage.from("attachments").upload(`${taskId}/${file.name}`, file, { upsert: true });
    setFiles(f => [...f, file.name]);
  }

  return (
    <div>
      <h3>Fichiers joints</h3>
      <input type="file" ref={fileRef} onChange={handleUpload} />
      <ul>
        {files.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
    </div>
  );
}
