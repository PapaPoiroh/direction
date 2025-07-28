import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

export default function GED() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // 1. Charger la liste des fichiers (depuis la table ged_documents)
  useEffect(() => {
    async function fetchFiles() {
      const { data, error } = await supabase
        .from("ged_documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setFiles(data || []);
    }
    fetchFiles();
  }, []);

  // 2. Gérer l'upload
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filePath = `${Date.now()}_${file.name}`;
    // Upload dans le bucket "ged"
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("ged")
      .upload(filePath, file, { upsert: false });
    if (uploadError) {
      alert("Erreur upload : " + uploadError.message);
      setUploading(false);
      return;
    }
    // URL publique
    const { data: publicUrl } = supabase.storage.from("ged").getPublicUrl(filePath);
    // Ajout entrée BDD
    await supabase.from("ged_documents").insert([{
      filename: file.name,
      file_url: publicUrl.publicUrl,
      created_at: new Date().toISOString(),
      // Ajoute uploaded_by si tu gères l'auth utilisateur
    }]);
    // Rafraîchir la liste
    const { data } = await supabase.from("ged_documents").select("*").order("created_at", { ascending: false });
    setFiles(data || []);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  // 3. Suppression (optionnelle)
  async function handleDelete(id: string, url: string) {
    if (!confirm("Supprimer ce fichier ?")) return;
    // Supprime du storage
    const filePath = url.split("/ged/")[1];
    await supabase.storage.from("ged").remove([filePath]);
    // Supprime de la BDD
    await supabase.from("ged_documents").delete().eq("id", id);
    setFiles(files.filter(f => f.id !== id));
  }

  return (
    <div>
      <h1>GED – Gestion Électronique des Documents</h1>
      <input type="file" ref={fileRef} onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Envoi en cours...</p>}
      <ul>
        {files.map(f => (
          <li key={f.id}>
            <a href={f.file_url} target="_blank" rel="noopener noreferrer">{f.filename}</a>
            <button onClick={() => handleDelete(f.id, f.file_url)} style={{marginLeft:10}}>Supprimer</button>
          </li>
        ))}
      </ul>
      {!files.length && <p>Aucun fichier pour le moment.</p>}
    </div>
  );
}
