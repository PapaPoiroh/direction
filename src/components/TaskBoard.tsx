import React from 'react';
import TaskCard from './TaskCard';

type Task = {
  id: string | number;
  title: string;
  description: string;
  due_date?: string;
  assigned_to_name?: string;
  status: string;
};

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string | number, newStatus: string) => void;
  onNotify: (taskId: string | number) => void;
  onAddToAgenda: (taskId: string | number) => void;
}

export default function TaskBoard({ tasks, onStatusChange, onNotify, onAddToAgenda }: TaskBoardProps) {
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
