export default function CalendarView({ tasks }: { tasks: any[] }) {
  // Pour une vraie vue calendrier, utilise react-big-calendar ou FullCalendar (à installer !)
  // Ici affichage sommaire
  return (
    <div>
      <h3>Calendrier</h3>
      <ul>
        {tasks.filter(t=>t.due_date).map(t=>(
          <li key={t.id}>{t.title} – {t.due_date}</li>
        ))}
      </ul>
    </div>
  );
}
