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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, BookOpen, Upload, MessageSquare } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isJoinClassOpen, setIsJoinClassOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [submittingTask, setSubmittingTask] = useState<Task | null>(null);
  const [currentSubmission, setCurrentSubmission] = useState<any | null>(null);
  const [taskStatus, setTaskStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');

  // Form states
  const [classCode, setClassCode] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [imageName, setImageName] = useState('');

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

  // Check for new teacher comments periodically
  useEffect(() => {
    if (selectedClass && user && tasks.length > 0) {
      const checkForNewComments = async () => {
        try {
          for (const task of tasks) {
            const submission = await supabaseService.getSubmissionByTaskAndStudent(task.id, user.id);
            if (submission?.teacherComment) {
              // Check if we've seen this comment before (simple check)
              const commentKey = `seen-comment-${submission.id}`;
              if (!localStorage.getItem(commentKey)) {
                localStorage.setItem(commentKey, 'true');
                toast({
                  title: 'New feedback! 💬',
                  description: `Your teacher commented on "${task.title}"`,
                  duration: 5000,
                });
              }
            }
          }
        } catch (error) {
          // Silently fail - this is just for notifications
        }
      };
      
      const interval = setInterval(checkForNewComments, 15000); // Check every 15 seconds
      return () => clearInterval(interval);
    }
  }, [tasks, selectedClass, user, toast]);

  const loadClasses = async () => {
    try {
      const studentClasses = await supabaseService.getStudentClasses(user!.id);
      setClasses(studentClasses);
      if (studentClasses.length > 0 && !selectedClass) {
        setSelectedClass(studentClasses[0]);
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

  const handleUpdateTaskStatus = async (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    // Optimistically update the UI immediately
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    
    try {
      await supabaseService.updateTask(taskId, { status: newStatus });
      // Reload to ensure sync
      await loadTasks();
      
      // Show notification if moved to done
      if (newStatus === 'done') {
        toast({
          title: 'Task completed! 🎉',
          description: 'Your teacher will be notified',
        });
      } else {
        toast({
          title: 'Status updated',
          description: 'Task progress has been updated',
        });
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      // Revert on error
      await loadTasks();
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive',
      });
    }
  };

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const classToJoin = await supabaseService.getClassByCode(classCode);
      
      if (!classToJoin) {
        toast({
          title: 'Class not found',
          description: 'Invalid class code',
          variant: 'destructive',
        });
        return;
      }

      await supabaseService.addClassMember({
        class_id: classToJoin.id,
        student_id: user!.id,
      });

      await loadClasses();
      setClassCode('');
      setIsJoinClassOpen(false);
      toast({
        title: 'Joined successfully',
        description: `You've joined ${classToJoin.name}`,
      });
    } catch (error: any) {
      console.error('Error joining class:', error);
      if (error.code === '23505') {
        toast({
          title: 'Already enrolled',
          description: 'You are already a member of this class',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to join class',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSubmitTask = async (task: Task) => {
    setSubmittingTask(task);
    setTaskStatus(task.status);
    try {
      const existingSubmission = await supabaseService.getSubmissionByTaskAndStudent(task.id, user!.id);
      if (existingSubmission) {
        setCurrentSubmission(existingSubmission);
        setTextAnswer(existingSubmission.textAnswer || '');
        setLinkUrl(existingSubmission.linkUrl || '');
        setFileName(existingSubmission.fileUrl || '');
        setImageName(existingSubmission.imageUrl || '');
      } else {
        setCurrentSubmission(null);
        setTextAnswer('');
        setLinkUrl('');
        setFileName('');
        setImageName('');
      }
    } catch (error) {
      console.error('Error loading submission:', error);
    }
    setIsSubmitOpen(true);
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTask) return;

    try {
      // Update submission
      await supabaseService.upsertSubmission({
        task_id: submittingTask.id,
        student_id: user!.id,
        text_answer: textAnswer || undefined,
        link_url: linkUrl || undefined,
        file_url: fileName || undefined,
        image_url: imageName || undefined,
      });

      // Update task status if changed
      if (taskStatus !== submittingTask.status) {
        await supabaseService.updateTask(submittingTask.id, { status: taskStatus });
        await loadTasks();
      }

      toast({ title: 'Submission successful' });
      resetSubmissionForm();
      setIsSubmitOpen(false);
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit answer',
        variant: 'destructive',
      });
    }
  };

  const resetSubmissionForm = () => {
    setTextAnswer('');
    setLinkUrl('');
    setFileName('');
    setImageName('');
    setSubmittingTask(null);
    setCurrentSubmission(null);
    setTaskStatus('todo');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">View and complete your assignments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>My Classes</span>
                <Dialog open={isJoinClassOpen} onOpenChange={setIsJoinClassOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Join a Class</DialogTitle>
                      <DialogDescription>Enter the class code provided by your teacher</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleJoinClass} className="space-y-4">
                      <div>
                        <Label htmlFor="classCode">Class Code</Label>
                        <Input
                          id="classCode"
                          value={classCode}
                          onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">Join Class</Button>
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
                    <CardDescription className="text-xs">Teacher: {cls.teacherName}</CardDescription>
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
              <Card>
                <CardHeader>
                  <CardTitle>{selectedClass.name} - Tasks</CardTitle>
                  <CardDescription>Complete your assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <KanbanBoard
                    tasks={tasks}
                    onSubmitTask={handleSubmitTask}
                    onUpdateTaskStatus={handleUpdateTaskStatus}
                    isStudent={true}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No class selected</p>
                  <p className="text-sm text-muted-foreground">Join a class to see your assignments</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={isSubmitOpen} onOpenChange={(open) => {
          setIsSubmitOpen(open);
          if (!open) resetSubmissionForm();
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Answer - {submittingTask?.title}</DialogTitle>
              <DialogDescription>Provide your answer using any of the methods below</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              {currentSubmission?.teacherComment && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    <Label className="text-sm font-semibold text-blue-900">Teacher's Feedback:</Label>
                  </div>
                  <p className="text-sm text-blue-800">{currentSubmission.teacherComment}</p>
                </div>
              )}
              
              <div>
                <Label htmlFor="taskStatus">Task Status</Label>
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
                <p className="text-xs text-muted-foreground mt-1">Update your progress status</p>
              </div>

              <div>
                <Label htmlFor="textAnswer">Text Answer</Label>
                <Textarea
                  id="textAnswer"
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="linkUrl">Link URL</Label>
                <Input
                  id="linkUrl"
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="fileUpload">Upload File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="fileUpload"
                    type="file"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {fileName && <span className="text-sm text-muted-foreground">{fileName}</span>}
                </div>
              </div>
              <div>
                <Label htmlFor="imageUpload">Upload Image</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {imageName && <span className="text-sm text-muted-foreground">{imageName}</span>}
                </div>
              </div>
              <Button type="submit" className="w-full gap-2">
                <Upload className="h-4 w-4" />
                Submit Answer
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}