import React from 'react';

type Task = {
  id: string | number;
  title: string;
  description: string;
  due_date?: string;
  assigned_to_name?: string;
  status: string;
};

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string | number, newStatus: string) => void;
  onNotify: (taskId: string | number) => void;
  onAddToAgenda: (taskId: string | number) => void;
}

export default function TaskCard({ task, onStatusChange, onNotify, onAddToAgenda }: TaskCardProps) {
  return (
    <div className="card task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div>Echéance : {task.due_date && new Date(task.due_date).toLocaleDateString()}</div>
      <div>Assignée à : {task.assigned_to_name || "Non attribuée"}</div>
      <div>
        Statut : 
        <select value={task.status} onChange={e => onStatusChange(task.id, e.target.value)}>
          <option>A Faire</option>
          <option>En Cours</option>
          <option>En Attente</option>
          <option>Terminé</option>
        </select>
      </div>
      <button onClick={() => onNotify(task.id)}>Notifier par email</button>
      <button onClick={() => onAddToAgenda(task.id)}>Ajouter à l'ordre du jour</button>
      {/* Checklist, pièces jointes, commentaires... */}
    </div>
  );
}
