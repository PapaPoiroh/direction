// Définis le type attendu pour task (adapte selon tes besoins réels)
type Task = {
  title: string;
  description: string;
  start: string; // date ISO
  end: string;   // date ISO
  // Ajoute d'autres champs si besoin
};

export async function addEventToGoogleCalendar(
  task: Task,
  userOAuthToken: string
): Promise<any> {
  const response = await fetch('/api/addToCalendar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, userOAuthToken }),
  });
  return response.json();
}
