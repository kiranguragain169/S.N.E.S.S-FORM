
import React from 'react';
import type { Student } from '../types';

interface StudentListProps {
  students: Student[];
}

const StudentCard: React.FC<{ student: Student }> = ({ student }) => (
  <li className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 col-span-1 flex flex-col">
    <div className="flex items-center space-x-4">
      <img className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 object-cover" src={student.profilePictureUrl || `https://i.pravatar.cc/150?u=${student.id}`} alt={`${student.firstName} ${student.lastName}`} />
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{student.firstName} {student.lastName}</h3>
        <p className="text-indigo-500 dark:text-indigo-400 font-medium">{student.major}</p>
      </div>
    </div>
    <div className="mt-4 flex-grow">
      <p className="text-gray-600 dark:text-gray-300 text-sm italic mb-4">"{student.bio || 'No bio provided.'}"</p>
    </div>
    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Date of Birth:</strong> {student.dateOfBirth}</p>
    </div>
  </li>
);


export const StudentList: React.FC<StudentListProps> = ({ students }) => {
  if (students.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No Students Enrolled</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fill out the form to add the first student.</p>
      </div>
    );
  }

  return (
    <div>
       <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center lg:text-left">Enrolled Students</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {students.map(student => <StudentCard key={student.id} student={student} />)}
      </ul>
    </div>
  );
};
