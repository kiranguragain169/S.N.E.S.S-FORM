import React, { useState } from 'react';
import { StudentForm } from './components/StudentForm';
import { StudentList } from './components/StudentList';
import type { Student } from './types';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  // FIX: Add a key to StudentForm to trigger a re-render and state reset on submit.
  const [formKey, setFormKey] = useState(0);

  const handleFormSubmit = (student: Student) => {
    setStudents(prevStudents => [student, ...prevStudents]);
    // FIX: Update the key to reset the form.
    setFormKey(prevKey => prevKey + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
            Student Enrollment Portal
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A modern enrollment experience powered by React, TypeScript, and Gemini AI.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <StudentForm key={formKey} onSubmit={handleFormSubmit} />
          </div>
          <div className="lg:col-span-3">
            <StudentList students={students} />
          </div>
        </main>
        
        <footer className="text-center mt-16 text-gray-500 dark:text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Gemini Student Form. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
