import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Utilisateurs() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("users").select("*").then(({ data }) => setUsers(data || []));
  }, []);
  return (
    <div>
      <h1>Utilisateurs</h1>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.email}</li>
        ))}
      </ul>
    </div>
  );
}
