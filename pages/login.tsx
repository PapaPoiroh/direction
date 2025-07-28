import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) router.push("/dashboard");
      else setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (!error) router.push("/dashboard");
      else setError(error.message);
    }
  }

  return (
    <div style={{maxWidth: 400, margin: '2rem auto'}}>
      <h1>{isLogin ? "Connexion" : "Inscription"}</h1>
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe" required />
        <button type="submit">{isLogin ? "Se connecter" : "S'inscrire"}</button>
      </form>
      {error && <div style={{color:"red"}}>{error}</div>}
      <button style={{marginTop: 8}} onClick={()=>setIsLogin(v=>!v)}>
        {isLogin ? "Créer un compte" : "Déjà inscrit ? Se connecter"}
      </button>
    </div>
  );
}
