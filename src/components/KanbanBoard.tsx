import { useState } from 'react';
import { Task } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onViewSubmissions?: (task: Task) => void;
  onSubmitTask?: (task: Task) => void;
  onUpdateTaskStatus?: (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => void;
  isStudent?: boolean;
}

export default function KanbanBoard({ 
  tasks, 
  onEditTask, 
  onDeleteTask, 
  onViewSubmissions,
  onSubmitTask,
  onUpdateTaskStatus,
  isStudent = false 
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'done', title: 'Done', color: 'bg-green-100' },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    if (isStudent) {
      setDraggedTask(task);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', task.id);
      // Make the dragged element semi-transparent
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.opacity = '0.5';
      }
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (isStudent) {
      setDraggedTask(null);
      setDragOverColumn(null);
      // Reset opacity
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.opacity = '1';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    if (isStudent && draggedTask) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: 'todo' | 'in-progress' | 'done') => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedTask && isStudent && onUpdateTaskStatus) {
      if (draggedTask.status !== newStatus) {
        onUpdateTaskStatus(draggedTask.id, newStatus);
      }
      setDraggedTask(null);
      setDragOverColumn(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map(column => (
        <div 
          key={column.id} 
          className={`rounded-lg p-4 ${column.color} ${isStudent ? 'min-h-[400px]' : ''} transition-all ${
            dragOverColumn === column.id && draggedTask ? 'ring-2 ring-indigo-500 ring-offset-2 scale-105' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.id as 'todo' | 'in-progress' | 'done')}
        >
          <h3 className="font-semibold text-lg mb-4 flex items-center justify-between">
            {column.title}
            <Badge variant="secondary">{getTasksByStatus(column.id).length}</Badge>
          </h3>
          <div className="space-y-3">
            {getTasksByStatus(column.id).map(task => (
              <Card 
                key={task.id} 
                className={`shadow-sm hover:shadow-lg transition-all ${
                  isStudent ? 'cursor-grab active:cursor-grabbing' : ''
                } ${draggedTask?.id === task.id ? 'opacity-30 scale-95' : 'hover:scale-105'}`}
                draggable={isStudent}
                onDragStart={(e) => handleDragStart(e, task)}
                onDragEnd={handleDragEnd}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                  {task.dueDate && (
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {isStudent ? (
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => onSubmitTask?.(task)}
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onViewSubmissions?.(task)}
                        className="w-full"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Submissions
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {getTasksByStatus(column.id).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                {isStudent ? 'Drag tasks here' : 'No tasks'}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}