import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

type GedDoc = {
  id: string;
  filename: string;
  file_url: string;
  created_at: string;
};

function isImage(filename: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
}
function isPDF(filename: string) {
  return /\.pdf$/i.test(filename);
}

export default function GED() {
  const [files, setFiles] = useState<GedDoc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchFiles(); }, []);

  async function fetchFiles() {
    setErrorMsg(null);
    const { data, error } = await supabase
      .from("ged_documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setErrorMsg("Erreur lors du chargement des fichiers");
    else setFiles(data || []);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErrorMsg(null);

    const cleanFileName = file.name.replace(/^.*[\\/]/, "");
    const filePath = `${Date.now()}_${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("ged")
      .upload(filePath, file, { upsert: false });
    if (uploadError) {
      setErrorMsg("Erreur upload : " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("ged").getPublicUrl(filePath);
    const publicUrl = urlData?.publicUrl;

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

  async function handleDelete(id: string, url: string) {
    if (!confirm("Supprimer ce fichier ?")) return;
    setErrorMsg(null);

    const matches = url.match(/\/storage\/v1\/object\/public\/ged\/(.+)$/);
    const filePath = matches?.[1];
    if (!filePath) {
      setErrorMsg("Impossible de retrouver le chemin du fichier dans le bucket.");
      return;
    }

    const { error: removeError } = await supabase.storage.from("ged").remove([filePath]);
    if (removeError) {
      setErrorMsg("Erreur suppression storage : " + removeError.message);
      return;
    }

    const { error: dbError } = await supabase.from("ged_documents").delete().eq("id", id);
    if (dbError) {
      setErrorMsg("Erreur suppression base de données : " + dbError.message);
      return;
    }

    setFiles(files.filter((f) => f.id !== id));
  }

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h1>GED – Gestion Électronique des Documents</h1>
      <div style={{display: "flex", alignItems: "center", gap: 12, marginBottom: 14}}>
        <input
          type="file"
          ref={fileRef}
          onChange={handleUpload}
          disabled={uploading}
        />
        <button
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          style={{
            marginLeft: 8,
            background: "#eee",
            padding: "6px 20px",
            border: "1px solid #aaa",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {viewMode === "grid" ? "Vue liste" : "Vue aperçus"}
        </button>
      </div>
      {uploading && <p>Envoi en cours...</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {viewMode === "grid" ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
          gap: 24,
          marginTop: 20
        }}>
          {files.map((f) => (
            <div key={f.id} style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              textAlign: "center",
              background: "#fafcff"
            }}>
              <FilePreview file={f} />
              <div style={{margin: "8px 0", fontSize: 14, fontWeight: 500}}>
                {f.filename}
              </div>
              <div style={{fontSize: 12, color: "#888"}}>
                {new Date(f.created_at).toLocaleString()}
              </div>
              <div>
                <a href={f.file_url} target="_blank" rel="noopener noreferrer"
                  style={{fontSize: 13, color: "#0070f3", marginRight: 10}}>
                  Télécharger
                </a>
                <button
                  onClick={() => handleDelete(f.id, f.file_url)}
                  style={{
                    color: "white",
                    background: "#b00",
                    border: "none",
                    borderRadius: 4,
                    padding: "2px 8px",
                    cursor: "pointer",
                    fontSize: 13
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul style={{marginTop: 16, padding: 0, listStyle: "none"}}>
          {files.map((f) => (
            <li key={f.id} style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #eaeaea",
              padding: "9px 0"
            }}>
              <FilePreview file={f} small />
              <span style={{flex: 1, marginLeft: 14}}>
                {f.filename}
                <span style={{color: "#888", fontSize: 12, marginLeft: 8}}>
                  ({new Date(f.created_at).toLocaleString()})
                </span>
              </span>
              <a href={f.file_url} target="_blank" rel="noopener noreferrer"
                style={{fontSize: 13, color: "#0070f3", marginRight: 10}}>
                Télécharger
              </a>
              <button
                onClick={() => handleDelete(f.id, f.file_url)}
                style={{
                  color: "white",
                  background: "#b00",
                  border: "none",
                  borderRadius: 4,
                  padding: "2px 8px",
                  cursor: "pointer",
                  fontSize: 13
                }}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
      {!files.length && <p>Aucun fichier pour le moment.</p>}
    </div>
  );
}

// Composant d'aperçu de fichier
function FilePreview({ file, small = false }: { file: GedDoc, small?: boolean }) {
  const size = small ? 32 : 100;
  if (isImage(file.filename)) {
    return (
      <a href={file.file_url} target="_blank" rel="noopener noreferrer">
        <img
          src={file.file_url}
          alt={file.filename}
          style={{
            width: size,
            height: size,
            objectFit: "cover",
            borderRadius: 6,
            boxShadow: small ? undefined : "0 2px 8px #0001"
          }}
        />
      </a>
    );
  }
  if (isPDF(file.filename)) {
    return (
      <a href={file.file_url} target="_blank" rel="noopener noreferrer"
        style={{display: "inline-block"}}>
        <span role="img" aria-label="PDF" style={{
          fontSize: small ? 24 : 48,
          color: "#d32",
          marginRight: 4
        }}>📄</span>
      </a>
    );
  }
  // Fichier inconnu : icône générique
  return (
    <a href={file.file_url} target="_blank" rel="noopener noreferrer"
      style={{display: "inline-block"}}>
      <span role="img" aria-label="Fichier" style={{
        fontSize: small ? 22 : 40,
        color: "#888"
      }}>📁</span>
    </a>
  );
}
