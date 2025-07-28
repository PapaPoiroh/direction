import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

type GedDoc = {
  id: string;
  filename: string;
  file_url: string;
  created_at: string;
};

export default function GED() {
  const [files, setFiles] = useState<GedDoc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Charger la liste des fichiers
  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    setErrorMsg(null);
    const { data, error } = await supabase
      .from("ged_documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setErrorMsg("Erreur lors du chargement des fichiers");
    else setFiles(data || []);
  }

  // Upload d'un fichier
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErrorMsg(null);

    const cleanFileName = file.name.replace(/^.*[\\/]/, ""); // Pour éviter tout chemin
    const filePath = `${Date.now()}_${cleanFileName}`;

    // 1. Upload sur Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("ged")
      .upload(filePath, file, { upsert: false });
    if (uploadError) {
      setErrorMsg("Erreur upload : " + uploadError.message);
      setUploading(false);
      return;
    }

    // 2. Générer l'URL publique
    const { data: urlData } = supabase.storage.from("ged").getPublicUrl(filePath);
    const publicUrl = urlData?.publicUrl;

    // 3. Enregistrer dans la BDD
    const { error: insertError } = await supabase.from("ged_documents").insert([
      {
        filename: cleanFileName,
        file_url: publicUrl,
        created_at: new Date().toISOString(),
      },
    ]);
    if (insertError) {
      setErrorMsg("Erreur base de données : " + insertError.message);
      setUploading(false);
      return;
    }

    await fetchFiles();
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  // Suppression d'un fichier
  async function handleDelete(id: string, url: string) {
    if (!confirm("Supprimer ce fichier ?")) return;
    setErrorMsg(null);

    // Retirer le chemin relatif à partir de l'URL publique
    const matches = url.match(/\/storage\/v1\/object\/public\/ged\/(.+)$/);
    const filePath = matches?.[1];
    if (!filePath) {
      setErrorMsg("Impossible de retrouver le chemin du fichier dans le bucket.");
      return;
    }

    // 1. Supprimer du storage
    const { error: removeError } = await supabase.storage.from("ged").remove([filePath]);
    if (removeError) {
      setErrorMsg("Erreur suppression storage : " + removeError.message);
      return;
    }

    // 2. Supprimer de la BDD
    const { error: dbError } = await supabase.from("ged_documents").delete().eq("id", id);
    if (dbError) {
      setErrorMsg("Erreur suppression base de données : " + dbError.message);
      return;
    }

    setFiles(files.filter((f) => f.id !== id));
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>GED – Gestion Électronique des Documents</h1>
      <input
        type="file"
        ref={fileRef}
        onChange={handleUpload}
        disabled={uploading}
        style={{ marginBottom: 12 }}
      />
      {uploading && <p>Envoi en cours...</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <ul>
        {files.map((f) => (
          <li key={f.id} style={{ marginBottom: 8 }}>
            <a href={f.file_url} target="_blank" rel="noopener noreferrer">
              {f.filename}
            </a>{" "}
            <span style={{ fontSize: "12px", color: "#888" }}>
              ({new Date(f.created_at).toLocaleString()})
            </span>
            <button
              onClick={() => handleDelete(f.id, f.file_url)}
              style={{
                marginLeft: 10,
                color: "white",
                background: "#b00",
                border: "none",
                borderRadius: 4,
                padding: "2px 8px",
                cursor: "pointer",
              }}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
      {!files.length && <p>Aucun fichier pour le moment.</p>}
    </div>
  );
}
