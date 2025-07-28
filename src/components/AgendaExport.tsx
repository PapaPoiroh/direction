import React from 'react';

type AgendaItem = {
  id: string | number;
  task_id: string | number;
  // Ajoute d'autres champs si besoin
};

type Task = {
  id: string | number;
  title: string;
  status: string;
  // Ajoute d'autres champs si besoin
};

interface AgendaExportProps {
  agendaItems: AgendaItem[];
  tasks: Task[];
}

export default function AgendaExport({ agendaItems, tasks }: AgendaExportProps) {
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
