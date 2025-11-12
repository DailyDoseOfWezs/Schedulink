// LocalStorage utilities for data persistence
export interface User {
  id: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
  name: string;
  avatarUrl?: string;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  teacherName: string;
  createdAt: string;
}

export interface Task {
  id: string;
  classId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdBy: string;
  createdAt: string;
  dueDate?: string;
}

export interface Submission {
  id: string;
  taskId: string;
  studentId: string;
  studentName: string;
  textAnswer?: string;
  fileUrl?: string;
  imageUrl?: string;
  linkUrl?: string;
  submittedAt: string;
  teacherComment?: string;
}

export interface Lab {
  id: string;
  name: string;
  number: number;
  isAvailable: boolean;
  currentSection?: string;
  teacherName?: string;
  qrCode: string;
  lastUpdated: string;
  building?: string;
  timeIn?: string;
  timeOut?: string;
  occupant?: string;
}

export interface ClassMember {
  classId: string;
  studentId: string;
  joinedAt: string;
}

class Storage {
  private getItem<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setItem<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Users
  getUsers(): User[] {
    return this.getItem<User>('users');
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.setItem('users', users);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  // Classes
  getClasses(): Class[] {
    return this.getItem<Class>('classes');
  }

  addClass(classData: Class): void {
    const classes = this.getClasses();
    classes.push(classData);
    this.setItem('classes', classes);
  }

  getClassByCode(code: string): Class | undefined {
    return this.getClasses().find(c => c.code === code);
  }

  getClassesByTeacher(teacherId: string): Class[] {
    return this.getClasses().filter(c => c.teacherId === teacherId);
  }

  // Class Members
  getClassMembers(): ClassMember[] {
    return this.getItem<ClassMember>('classMembers');
  }

  addClassMember(member: ClassMember): void {
    const members = this.getClassMembers();
    members.push(member);
    this.setItem('classMembers', members);
  }

  getStudentClasses(studentId: string): Class[] {
    const members = this.getClassMembers().filter(m => m.studentId === studentId);
    const classes = this.getClasses();
    return members.map(m => classes.find(c => c.id === m.classId)).filter(Boolean) as Class[];
  }

  getClassStudents(classId: string): User[] {
    const members = this.getClassMembers().filter(m => m.classId === classId);
    const users = this.getUsers();
    return members.map(m => users.find(u => u.id === m.studentId)).filter(Boolean) as User[];
  }

  // Tasks
  getTasks(): Task[] {
    return this.getItem<Task>('tasks');
  }

  addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.setItem('tasks', tasks);
  }

  updateTask(taskId: string, updates: Partial<Task>): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.setItem('tasks', tasks);
    }
  }

  deleteTask(taskId: string): void {
    const tasks = this.getTasks().filter(t => t.id !== taskId);
    this.setItem('tasks', tasks);
  }

  getTasksByClass(classId: string): Task[] {
    return this.getTasks().filter(t => t.classId === classId);
  }

  // Submissions
  getSubmissions(): Submission[] {
    return this.getItem<Submission>('submissions');
  }

  addSubmission(submission: Submission): void {
    const submissions = this.getSubmissions();
    const existing = submissions.findIndex(
      s => s.taskId === submission.taskId && s.studentId === submission.studentId
    );
    if (existing !== -1) {
      submissions[existing] = submission;
    } else {
      submissions.push(submission);
    }
    this.setItem('submissions', submissions);
  }

  getSubmissionsByTask(taskId: string): Submission[] {
    return this.getSubmissions().filter(s => s.taskId === taskId);
  }

  getSubmissionByTaskAndStudent(taskId: string, studentId: string): Submission | undefined {
    return this.getSubmissions().find(s => s.taskId === taskId && s.studentId === studentId);
  }

  // Labs
  getLabs(): Lab[] {
    const labs = this.getItem<Lab>('labs');
    if (labs.length === 0) {
      // Initialize 5 labs
      const initialLabs: Lab[] = Array.from({ length: 5 }, (_, i) => ({
        id: `lab-${i + 1}`,
        name: `Computer Laboratory ${i + 1}`,
        number: i + 1,
        isAvailable: true,
        qrCode: `LAB${i + 1}-${Date.now()}`,
        lastUpdated: new Date().toISOString(),
      }));
      this.setItem('labs', initialLabs);
      return initialLabs;
    }
    return labs;
  }

  updateLab(labId: string, updates: Partial<Lab>): void {
    const labs = this.getLabs();
    const index = labs.findIndex(l => l.id === labId);
    if (index !== -1) {
      labs[index] = { ...labs[index], ...updates, lastUpdated: new Date().toISOString() };
      this.setItem('labs', labs);
      // Trigger storage event for real-time updates
      window.dispatchEvent(new Event('storage'));
    }
  }

  getLabByQRCode(qrCode: string): Lab | undefined {
    return this.getLabs().find(l => l.qrCode === qrCode);
  }
}

export const storage = new Storage();