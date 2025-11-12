import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseService, Class, Task } from '@/lib/supabaseService';
import Navbar from '@/components/Navbar';
import KanbanBoard from '@/components/KanbanBoard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [commentingSubmission, setCommentingSubmission] = useState<any | null>(null);
  const [teacherComment, setTeacherComment] = useState('');

  // Form states
  const [className, setClassName] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');
  const [taskDueDate, setTaskDueDate] = useState('');

  useEffect(() => {
    if (user) {
      loadClasses();
    }
  }, [user]);

  useEffect(() => {
    if (selectedClass) {
      loadTasks();
    }
  }, [selectedClass]);

  // Check for completed tasks (students marking tasks as done)
  useEffect(() => {
    if (selectedClass && tasks.length > 0) {
      const checkCompletedTasks = async () => {
        try {
          for (const task of tasks) {
            if (task.status === 'done') {
              // Check if we've notified about this task completion
              const notificationKey = `notified-done-${task.id}`;
              if (!localStorage.getItem(notificationKey)) {
                // Get submissions to see which students completed it
                const submissions = await supabaseService.getSubmissionsByTask(task.id);
                const completedStudents = submissions.map(s => s.studentName).join(', ');
                
                if (completedStudents) {
                  toast({
                    title: 'Task completed! ✅',
                    description: `${completedStudents} completed "${task.title}"`,
                    duration: 5000,
                  });
                  localStorage.setItem(notificationKey, 'true');
                }
              }
            }
          }
        } catch (error) {
          // Silently fail
        }
      };
      
      const interval = setInterval(checkCompletedTasks, 20000); // Check every 20 seconds
      return () => clearInterval(interval);
    }
  }, [tasks, selectedClass, toast]);

  const loadClasses = async () => {
    try {
      const userClasses = await supabaseService.getClassesByTeacher(user!.id);
      setClasses(userClasses);
      if (userClasses.length > 0 && !selectedClass) {
        setSelectedClass(userClasses[0]);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load classes',
        variant: 'destructive',
      });
    }
  };

  const loadTasks = async () => {
    if (selectedClass) {
      try {
        const classTasks = await supabaseService.getTasksByClass(selectedClass.id);
        setTasks(classTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  };

  const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const code = generateClassCode();
      const newClass = await supabaseService.createClass({
        name: className,
        code,
        teacher_id: user!.id,
      });
      
      await loadClasses();
      setClassName('');
      setIsCreateClassOpen(false);
      toast({
        title: 'Class created',
        description: `Class code: ${code}`,
      });
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        title: 'Error',
        description: 'Failed to create class',
        variant: 'destructive',
      });
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;

    try {
      if (editingTask) {
        await supabaseService.updateTask(editingTask.id, {
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
          dueDate: taskDueDate || undefined,
        });
        toast({ title: 'Task updated successfully' });
      } else {
        await supabaseService.createTask({
          class_id: selectedClass.id,
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
          created_by: user!.id,
          due_date: taskDueDate || undefined,
        });
        toast({ title: 'Task created successfully' });
      }

      await loadTasks();
      resetTaskForm();
      setIsTaskDialogOpen(false);
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: 'Error',
        description: 'Failed to save task',
        variant: 'destructive',
      });
    }
  };

  const resetTaskForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskStatus('todo');
    setTaskDueDate('');
    setEditingTask(null);
  };

  const handleAddComment = (submission: any) => {
    setCommentingSubmission(submission);
    setTeacherComment(submission.teacherComment || '');
  };

  const handleSaveComment = async () => {
    if (!commentingSubmission) return;
    
    try {
      await supabaseService.updateSubmissionComment(commentingSubmission.id, teacherComment);
      await supabaseService.getSubmissionsByTask(viewingTask!.id).then(setSubmissions).catch(console.error);
      setCommentingSubmission(null);
      setTeacherComment('');
      toast({
        title: 'Comment saved',
        description: `${commentingSubmission.studentName} will be notified of your feedback`,
      });
    } catch (error) {
      console.error('Error saving comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to save comment',
        variant: 'destructive',
      });
    }
  };

  const handleViewSubmissions = (task: Task) => {
    setViewingTask(task);
    setIsSubmissionsOpen(true);
  };

  useEffect(() => {
    if (viewingTask) {
      supabaseService.getSubmissionsByTask(viewingTask.id).then(setSubmissions).catch(console.error);
    }
  }, [viewingTask]);

  useEffect(() => {
    if (selectedClass) {
      supabaseService.getClassStudents(selectedClass.id).then(setClassStudents).catch(console.error);
    }
  }, [selectedClass]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage your classes and assignments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>My Classes</span>
                <Dialog open={isCreateClassOpen} onOpenChange={setIsCreateClassOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Class</DialogTitle>
                      <DialogDescription>Create a new class and get a unique code</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateClass} className="space-y-4">
                      <div>
                        <Label htmlFor="className">Class Name</Label>
                        <Input
                          id="className"
                          value={className}
                          onChange={(e) => setClassName(e.target.value)}
                          placeholder="e.g., Math 101"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">Create Class</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {classes.map(cls => (
                <Card
                  key={cls.id}
                  className={`cursor-pointer transition-all ${
                    selectedClass?.id === cls.id ? 'ring-2 ring-indigo-600' : ''
                  }`}
                  onClick={() => setSelectedClass(cls)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">{cls.name}</CardTitle>
                    <CardDescription className="text-xs">Code: {cls.code}</CardDescription>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Users className="h-3 w-3" />
                      {classStudents.length} students
                    </div>
                  </CardHeader>
                </Card>
              ))}
              {classes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No classes yet</p>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            {selectedClass ? (
              <Tabs defaultValue="tasks" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                </TabsList>
                <TabsContent value="tasks" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{selectedClass.name} - Tasks</CardTitle>
                          <CardDescription>Manage assignments and track progress</CardDescription>
                        </div>
                        <Dialog open={isTaskDialogOpen} onOpenChange={(open) => {
                          setIsTaskDialogOpen(open);
                          if (!open) resetTaskForm();
                        }}>
                          <DialogTrigger asChild>
                            <Button className="gap-2">
                              <Plus className="h-4 w-4" />
                              Add Task
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateTask} className="space-y-4">
                              <div>
                                <Label htmlFor="taskTitle">Title</Label>
                                <Input
                                  id="taskTitle"
                                  value={taskTitle}
                                  onChange={(e) => setTaskTitle(e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="taskDescription">Description</Label>
                                <Textarea
                                  id="taskDescription"
                                  value={taskDescription}
                                  onChange={(e) => setTaskDescription(e.target.value)}
                                  rows={3}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="taskStatus">Status</Label>
                                <Select value={taskStatus} onValueChange={(value: 'todo' | 'in-progress' | 'done') => setTaskStatus(value)}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="todo">To Do</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="done">Done</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="taskDueDate">Due Date (Optional)</Label>
                                <Input
                                  id="taskDueDate"
                                  type="date"
                                  value={taskDueDate}
                                  onChange={(e) => setTaskDueDate(e.target.value)}
                                />
                              </div>
                              <Button type="submit" className="w-full">
                                {editingTask ? 'Update Task' : 'Create Task'}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <KanbanBoard
                        tasks={tasks}
                        onViewSubmissions={handleViewSubmissions}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="students">
                  <Card>
                    <CardHeader>
                      <CardTitle>Enrolled Students</CardTitle>
                      <CardDescription>{classStudents.length} students in this class</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {classStudents.map(student => (
                          <Card key={student.id}>
                            <CardHeader className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-sm">{student.name}</CardTitle>
                                  <CardDescription className="text-xs">{student.email}</CardDescription>
                                </div>
                                <Badge variant="secondary">Student</Badge>
                              </div>
                            </CardHeader>
                          </Card>
                        ))}
                        {classStudents.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-8">No students enrolled yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No class selected</p>
                  <p className="text-sm text-muted-foreground">Create or select a class to get started</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={isSubmissionsOpen} onOpenChange={setIsSubmissionsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submissions - {viewingTask?.title}</DialogTitle>
              <DialogDescription>View student submissions for this task</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {submissions.map(submission => (
                <Card key={submission.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">{submission.studentName}</CardTitle>
                    <CardDescription className="text-xs">
                      Submitted: {new Date(submission.submittedAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {submission.textAnswer && (
                      <div>
                        <Label className="text-xs">Text Answer:</Label>
                        <p className="text-sm mt-1 bg-slate-50 p-2 rounded">{submission.textAnswer}</p>
                      </div>
                    )}
                    {submission.linkUrl && (
                      <div>
                        <Label className="text-xs">Link:</Label>
                        <a href={submission.linkUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block mt-1">
                          {submission.linkUrl}
                        </a>
                      </div>
                    )}
                    {submission.fileUrl && (
                      <div>
                        <Label className="text-xs">File:</Label>
                        <p className="text-sm mt-1">{submission.fileUrl}</p>
                      </div>
                    )}
                    {submission.imageUrl && (
                      <div>
                        <Label className="text-xs">Image:</Label>
                        <p className="text-sm mt-1">{submission.imageUrl}</p>
                      </div>
                    )}
                    {submission.teacherComment && (
                      <div className="mt-3 pt-3 border-t">
                        <Label className="text-xs font-semibold">Your Comment:</Label>
                        <p className="text-sm mt-1 bg-blue-50 p-2 rounded">{submission.teacherComment}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {commentingSubmission?.id === submission.id ? (
                        <div className="flex-1 space-y-2">
                          <Textarea
                            value={teacherComment}
                            onChange={(e) => setTeacherComment(e.target.value)}
                            placeholder="Add your comment or feedback..."
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveComment}>
                              Save Comment
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setCommentingSubmission(null);
                                setTeacherComment('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAddComment(submission)}
                          className="w-full"
                        >
                          {submission.teacherComment ? 'Edit Comment' : 'Add Comment'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {submissions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No submissions yet</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}