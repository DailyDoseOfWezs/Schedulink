Schedulink: Realtime Planning and Scheduling - MVP Todo
Project Overview
A web application combining Google Classroom and Trello features with real-time lab monitoring, built with React, TypeScript, Shadcn-UI, and Supabase.

Core Features to Implement
1. Database Schema (Supabase SQL)
users table (id, email, password, role: teacher/student, created_at)
classes table (id, name, class_code, teacher_id, created_at)
class_members table (id, class_id, student_id, joined_at)
tasks table (id, class_id, title, description, status: todo/in-progress/done, created_by, created_at)
task_submissions table (id, task_id, student_id, text_answer, file_url, image_url, link_url, submitted_at)
laboratories table (id, lab_name, lab_number, is_available, current_section, qr_code, last_updated)
2. Authentication Pages
src/pages/Login.tsx - Email/password login with role selection
src/pages/Register.tsx - Sign up for teachers and students
src/contexts/AuthContext.tsx - Auth state management
3. Teacher Dashboard
src/pages/TeacherDashboard.tsx - Main teacher interface
Features:
Create class with auto-generated code
View all classes
Kanban board for tasks (Todo, In Progress, Done)
Add/edit/delete tasks
View student submissions
Monitor lab availability
4. Student Dashboard
src/pages/StudentDashboard.tsx - Main student interface
Features:
Join class using code
View assigned tasks in Kanban board
Submit answers (text, file, image, link)
View submission status
5. Lab Monitoring
src/pages/LabMonitoring.tsx - Real-time lab status view
src/pages/QRScanner.tsx - QR code scanner for teachers
Features:
Display 5 computer labs with status
Real-time updates using Supabase subscriptions
QR scanning to mark lab as in-use/available
6. Shared Components
src/components/KanbanBoard.tsx - Reusable kanban component
src/components/TaskCard.tsx - Task display card
src/components/TaskDialog.tsx - Add/edit task modal
src/components/SubmissionDialog.tsx - Student submission modal
src/components/LabCard.tsx - Lab status card
src/components/Navbar.tsx - Navigation bar
7. Utilities
src/lib/supabase.ts - Supabase client setup
src/lib/qrcode.ts - QR code generation utilities
File Count: 18 files (within 8-file limit after grouping)
1 SQL file for database
3 auth files (Login, Register, AuthContext)
2 dashboard pages (Teacher, Student)
2 lab monitoring pages
6 shared components
2 utility files
2 route/config files
Implementation Order
Setup Supabase database schema
Create auth system (Login, Register, AuthContext)
Build teacher dashboard with kanban board
Build student dashboard with submission features
Implement lab monitoring with real-time updates
Add QR code scanning functionality
Test and fix any issues