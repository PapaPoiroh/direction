import React from 'react';

export default function AgendaExport({ agendaItems, tasks }) {
  return (
    <div>
      <h3>Ordre du jour</h3>
      <ul>
        {agendaItems.map(item => {
          const task = tasks.find(t => t.id === item.task_id);
          return <li key={item.id}>{task?.title} — Statut : {task?.status}</li>
        })}
      </ul>
      <button onClick={() => {/* export PDF ou Word */}}>Exporter</button>
    </div>
  );
}