import { supabase } from './supabase';
import type { Class, Task, Submission, Lab, ClassMember, User } from './storage';

// Type definitions matching the storage interface
export type { Class, Task, Submission, Lab, ClassMember, User };

export const supabaseService = {
  // Profile operations
  async getProfileByAuthId(authUserId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateProfile(profileId: string, updates: { full_name?: string; avatar_url?: string }) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profileId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createProfile(profile: {
    auth_user_id: string;
    email: string;
    full_name: string;
    role: 'teacher' | 'student';
  }) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProfileById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Class operations
  async getClassesByTeacher(teacherId: string): Promise<Class[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*, profiles!classes_teacher_id_fkey(full_name)')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      teacherId: c.teacher_id,
      teacherName: c.profiles?.full_name || '',
      createdAt: c.created_at,
    }));
  },

  async getClassByCode(code: string): Promise<Class | null> {
    const { data, error } = await supabase
      .from('classes')
      .select('*, profiles!classes_teacher_id_fkey(full_name)')
      .eq('code', code.toUpperCase())
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      code: data.code,
      teacherId: data.teacher_id,
      teacherName: (data.profiles as any)?.full_name || '',
      createdAt: data.created_at,
    };
  },

  async createClass(classData: {
    name: string;
    code: string;
    teacher_id: string;
  }): Promise<Class> {
    const { data, error } = await supabase
      .from('classes')
      .insert(classData)
      .select('*, profiles!classes_teacher_id_fkey(full_name)')
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      code: data.code,
      teacherId: data.teacher_id,
      teacherName: (data.profiles as any)?.full_name || '',
      createdAt: data.created_at,
    };
  },

  // Class member operations
  async getStudentClasses(studentId: string): Promise<Class[]> {
    const { data, error } = await supabase
      .from('class_members')
      .select('*, classes(*, profiles!classes_teacher_id_fkey(full_name))')
      .eq('student_id', studentId)
      .order('joined_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map((cm: any) => ({
      id: cm.classes.id,
      name: cm.classes.name,
      code: cm.classes.code,
      teacherId: cm.classes.teacher_id,
      teacherName: cm.classes.profiles?.full_name || '',
      createdAt: cm.classes.created_at,
    }));
  },

  async addClassMember(member: { class_id: string; student_id: string }) {
    const { data, error } = await supabase
      .from('class_members')
      .insert(member)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getClassStudents(classId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('class_members')
      .select('*, profiles(*)')
      .eq('class_id', classId);
    
    if (error) throw error;
    
    return data.map((cm: any) => ({
      id: cm.profiles.id,
      email: cm.profiles.email,
      name: cm.profiles.full_name,
      role: cm.profiles.role,
      password: '', // Not needed from DB
    }));
  },

  // Task operations
  async getTasksByClass(classId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(t => ({
      id: t.id,
      classId: t.class_id,
      title: t.title,
      description: t.description,
      status: t.status,
      createdBy: t.created_by,
      createdAt: t.created_at,
      dueDate: t.due_date,
    }));
  },

  async createTask(task: {
    class_id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    created_by: string;
    due_date?: string;
  }): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      classId: data.class_id,
      title: data.title,
      description: data.description,
      status: data.status,
      createdBy: data.created_by,
      createdAt: data.created_at,
      dueDate: data.due_date,
    };
  },

  async updateTask(taskId: string, updates: Partial<Task>) {
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteTask(taskId: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    
    if (error) throw error;
  },

  // Submission operations
  async getSubmissionsByTask(taskId: string): Promise<Submission[]> {
    const { data, error } = await supabase
      .from('task_submissions')
      .select('*, profiles(full_name)')
      .eq('task_id', taskId)
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map((s: any) => ({
      id: s.id,
      taskId: s.task_id,
      studentId: s.student_id,
      studentName: s.profiles?.full_name || '',
      textAnswer: s.text_answer,
      fileUrl: s.file_url,
      imageUrl: s.image_url,
      linkUrl: s.link_url,
      submittedAt: s.submitted_at,
      teacherComment: s.teacher_comment,
    }));
  },

  async getSubmissionByTaskAndStudent(taskId: string, studentId: string): Promise<Submission | null> {
    const { data, error } = await supabase
      .from('task_submissions')
      .select('*, profiles(full_name)')
      .eq('task_id', taskId)
      .eq('student_id', studentId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      taskId: data.task_id,
      studentId: data.student_id,
      studentName: (data.profiles as any)?.full_name || '',
      textAnswer: data.text_answer,
      fileUrl: data.file_url,
      imageUrl: data.image_url,
      linkUrl: data.link_url,
      submittedAt: data.submitted_at,
      teacherComment: data.teacher_comment,
    };
  },

  async upsertSubmission(submission: {
    task_id: string;
    student_id: string;
    text_answer?: string;
    file_url?: string;
    image_url?: string;
    link_url?: string;
  }) {
    const { data, error } = await supabase
      .from('task_submissions')
      .upsert(submission, {
        onConflict: 'task_id,student_id',
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Lab operations
  async getLabs(): Promise<Lab[]> {
    const { data, error } = await supabase
      .from('labs')
      .select('*')
      .order('building', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return data.map(l => ({
      id: l.id,
      name: l.name,
      number: l.number,
      qrCode: l.qr_code,
      isAvailable: l.is_available,
      currentSection: l.current_section,
      teacherName: l.teacher_name,
      lastUpdated: l.last_updated,
      building: l.building,
      timeIn: l.time_in,
      timeOut: l.time_out,
      occupant: l.occupant,
    }));
  },

  async getLabById(labId: string): Promise<Lab | null> {
    const { data, error } = await supabase
      .from('labs')
      .select('*')
      .eq('id', labId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      number: data.number,
      qrCode: data.qr_code,
      isAvailable: data.is_available,
      currentSection: data.current_section,
      teacherName: data.teacher_name,
      lastUpdated: data.last_updated,
      building: data.building,
      timeIn: data.time_in,
      timeOut: data.time_out,
      occupant: data.occupant,
    };
  },

  async updateLab(labId: string, updates: Partial<Lab>) {
    const updateData: any = {};
    if (updates.isAvailable !== undefined) updateData.is_available = updates.isAvailable;
    if (updates.currentSection !== undefined) updateData.current_section = updates.currentSection;
    if (updates.teacherName !== undefined) updateData.teacher_name = updates.teacherName;
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.building !== undefined) updateData.building = updates.building;
    if (updates.occupant !== undefined) updateData.occupant = updates.occupant;
    if (updates.timeIn !== undefined) updateData.time_in = updates.timeIn;
    if (updates.timeOut !== undefined) updateData.time_out = updates.timeOut;
    updateData.last_updated = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('labs')
      .update(updateData)
      .eq('id', labId)
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      number: data.number,
      qrCode: data.qr_code,
      isAvailable: data.is_available,
      currentSection: data.current_section,
      teacherName: data.teacher_name,
      lastUpdated: data.last_updated,
      building: data.building,
      timeIn: data.time_in,
      timeOut: data.time_out,
      occupant: data.occupant,
    };
  },

  // Create new lab/room
  async createLab(labData: {
    name: string;
    number: number;
    qr_code: string;
    building?: string;
    is_available?: boolean;
  }): Promise<Lab> {
    const { data, error } = await supabase
      .from('labs')
      .insert({
        name: labData.name,
        number: labData.number,
        qr_code: labData.qr_code,
        building: labData.building || 'COMLAB BUILDING',
        is_available: labData.is_available !== undefined ? labData.is_available : true,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      number: data.number,
      qrCode: data.qr_code,
      isAvailable: data.is_available,
      currentSection: data.current_section,
      teacherName: data.teacher_name,
      lastUpdated: data.last_updated,
      building: data.building,
      timeIn: data.time_in,
      timeOut: data.time_out,
      occupant: data.occupant,
    };
  },

  // Update submission with teacher comment
  async updateSubmissionComment(submissionId: string, teacherComment: string) {
    const { data, error } = await supabase
      .from('task_submissions')
      .update({ teacher_comment: teacherComment })
      .eq('id', submissionId)
      .select('*, profiles(full_name)')
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      taskId: data.task_id,
      studentId: data.student_id,
      studentName: (data.profiles as any)?.full_name || '',
      textAnswer: data.text_answer,
      fileUrl: data.file_url,
      imageUrl: data.image_url,
      linkUrl: data.link_url,
      submittedAt: data.submitted_at,
      teacherComment: data.teacher_comment,
    };
  },
};

