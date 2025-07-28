import React from 'react';
import TaskCard from './TaskCard';

export default function TaskBoard({ tasks, onStatusChange, onNotify, onAddToAgenda }) {
  const statusColumns = ['A Faire', 'En Cours', 'En Attente', 'Terminé'];
  return (
    <div className="kanban-board">
      {statusColumns.map(status => (
        <div key={status} className="kanban-column">
          <h4>{status}</h4>
          {tasks.filter(t => t.status === status).map(task => 
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onNotify={onNotify}
              onAddToAgenda={onAddToAgenda}
            />
          )}
        </div>
      ))}
    </div>
  );
}