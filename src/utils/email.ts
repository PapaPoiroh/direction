import nodemailer from 'nodemailer';

export async function sendTaskStatusNotification(to, task, status) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject: `Mise à jour tâche : ${task.title}`,
    text: `La tâche "${task.title}" est maintenant "${status}". Lien: ...`,
  });
}