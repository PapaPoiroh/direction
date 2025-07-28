// Ce fichier ne doit plus contenir d'import Node.js
// Remplace son contenu par un appel fetch vers l'API Next.js si tu as besoin côté client

export async function addEventToGoogleCalendar(task, userOAuthToken) {
  const response = await fetch('/api/addToCalendar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, userOAuthToken }),
  });
  return response.json();
}