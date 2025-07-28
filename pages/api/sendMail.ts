import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { to, task, status } = req.body;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'direction@ton-domaine.com',
      to,
      subject: `Mise à jour tâche : ${task.title}`,
      text: `La tâche "${task.title}" est maintenant "${status}". Lien: ...`
    })
  });

  if (!response.ok) {
    return res.status(500).json({ error: 'Erreur lors de l’envoi du mail' });
  }
  res.status(200).json({ success: true });
}
