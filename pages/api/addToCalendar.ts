import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { task, userOAuthToken } = req.body;

  const calendar = google.calendar({ version: 'v3', auth: userOAuthToken });

  await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: task.title,
      description: task.description,
      start: { dateTime: task.start, timeZone: 'Europe/Paris' },
      end: { dateTime: task.end, timeZone: 'Europe/Paris' },
    },
  });

  res.status(200).json({ success: true });
}