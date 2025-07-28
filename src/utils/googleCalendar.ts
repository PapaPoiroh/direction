// Utilise OAuth2 côté client, refresh token côté serveur
import { google } from 'googleapis';

export async function addEventToGoogleCalendar(task, userOAuthToken) {
  const calendar = google.calendar({ version: 'v3', auth: userOAuthToken });
  await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: task.title,
      description: task.description,
      start: { date: task.due_date },
      end: { date: task.due_date },
      attendees: [{ email: task.assigned_to_email }]
    }
  });
}